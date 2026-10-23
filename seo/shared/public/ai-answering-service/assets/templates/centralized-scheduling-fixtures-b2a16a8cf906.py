"""Synthetic acceptance reference model. Offline only; NOT a provider adapter.
Run: python centralized-scheduling-fixtures.py
No network, credentials, live calendars, or product implementation claims.
"""
import copy
import json
import unittest
from datetime import datetime
from zoneinfo import ZoneInfo

BASE = dict(request_id='req-001', customer_id='cust-001', location_id='loc-001',
            branch_id='east', calendar_id='cal-east', time_zone='America/New_York',
            start='2026-11-02T09:00:00-05:00', end='2026-11-02T10:00:00-05:00')

class Model:
    def __init__(self):
        self.records = {}
        self.operations = {}
        self.log = []
        self.sequence = 0

    def outcome(self, request, state, reason, record_id=None):
        result = dict(request_id=request['request_id'], state=state, reason=reason,
                      record_id=record_id, owner='office-scheduler-east' if state == 'EXCEPTION_OWNED' else None)
        self.log.append(result)
        return result

    def create(self, request, availability=None, timeout=False, persist=True,
               reconcile=True, cancellation=False, cancel_fails=False, writable=True):
        r = copy.deepcopy(request)
        # This fixture pack intentionally supports the synthetic east branch only.
        if r['branch_id'] != 'east' or r['calendar_id'] != 'cal-east':
            return self.outcome(r, 'EXCEPTION_OWNED', 'wrong_branch')
        if r['time_zone'] != 'America/New_York':
            return self.outcome(r, 'EXCEPTION_OWNED', 'wrong_branch_zone')
        if not writable:
            return self.outcome(r, 'EXCEPTION_OWNED', 'permission_denied')
        for key in ('start', 'end'):
            dt = datetime.fromisoformat(r[key])
            if dt.utcoffset() != dt.astimezone(ZoneInfo(r['time_zone'])).utcoffset():
                return self.outcome(r, 'EXCEPTION_OWNED', 'local_time_mismatch')
        if datetime.fromisoformat(r['end']) <= datetime.fromisoformat(r['start']):
            return self.outcome(r, 'EXCEPTION_OWNED', 'invalid_interval')
        if availability is None:
            availability = {'cal-east': {'busy': []}, 'crew-east': {'busy': []}}
        required = {'cal-east', 'crew-east'}
        if not isinstance(availability, dict) or not required.issubset(availability) or any(
            not isinstance(availability[x], dict)
            or not isinstance(availability[x].get('busy'), list)
            or ('errors' in availability[x] and not isinstance(availability[x]['errors'], list))
            or bool(availability[x].get('errors'))
            for x in required
        ):
            return self.outcome(r, 'EXCEPTION_OWNED', 'availability_incomplete')
        if any(availability[x].get('busy') for x in required):
            return self.outcome(r, 'EXCEPTION_OWNED', 'not_available')
        op = self.operations.get(r['request_id'])
        if op and op['payload'] != r:
            return self.outcome(r, 'EXCEPTION_OWNED', 'operation_payload_changed')
        if not op:
            self.sequence += 1
            op = dict(payload=r, record_id='synthetic-record-' + str(self.sequence), cancellation=False)
            self.operations[r['request_id']] = op
        rid = op['record_id']
        self.outcome(r, 'WRITE_PENDING', 'intent_logged', rid)
        if cancellation:
            op['cancellation'] = True
        if persist and rid not in self.records:
            self.records[rid] = dict(payload=r, version=1, active=True)
        if timeout:
            self.outcome(r, 'WRITE_UNCERTAIN', 'timeout', rid)
        if not reconcile or rid not in self.records:
            return self.outcome(r, 'EXCEPTION_OWNED', 'write_unresolved', rid)
        if self.records[rid]['payload'] != r:
            return self.outcome(r, 'EXCEPTION_OWNED', 'persisted_payload_mismatch', rid)
        self.outcome(r, 'PERSISTED_RECORD_INSPECTED', 'exact_match', rid)
        if op['cancellation']:
            if cancel_fails:
                return self.outcome(r, 'EXCEPTION_OWNED', 'cancellation_pending', rid)
            self.records[rid]['active'] = False
            self.records[rid]['version'] += 1
            return self.outcome(r, 'CANCELLED', 'cancellation_verified', rid)
        return self.outcome(r, 'CONFIRMED', 'record_verified', rid)

    def change(self, rid, expected_version, new_start):
        current = self.records[rid]
        r = current['payload']
        if current['version'] != expected_version:
            return self.outcome(r, 'EXCEPTION_OWNED', 'stale_version', rid)
        # This narrow pack demonstrates stale-version rejection, not a full update adapter.
        # Never confirm an unimplemented mutation or reactivate a cancelled record.
        return self.outcome(r, 'EXCEPTION_OWNED', 'mutation_unsupported', rid)

class AcceptanceFixtures(unittest.TestCase):
    def test_duplicate_request(self):
        m = Model(); a = m.create(BASE); b = m.create(BASE)
        self.assertEqual(a['record_id'], b['record_id']); self.assertEqual(len(m.records), 1)
        self.assertEqual(b['state'], 'CONFIRMED')

    def test_wrong_branch(self):
        m = Model(); r = dict(BASE, calendar_id='cal-west')
        self.assertEqual(m.create(r)['reason'], 'wrong_branch'); self.assertFalse(m.records)

    def test_partial_availability_error(self):
        m = Model(); a = {'cal-east': {'busy': []}, 'crew-east': {'errors': ['internalError']}}
        self.assertEqual(m.create(BASE, availability=a)['reason'], 'availability_incomplete'); self.assertFalse(m.records)

    def test_missing_busy_field(self):
        m = Model(); a = {'cal-east': {'busy': []}, 'crew-east': {}}
        self.assertEqual(m.create(BASE, availability=a)['reason'], 'availability_incomplete')
        self.assertFalse(m.records)

    def test_malformed_errors_field(self):
        m = Model(); a = {'cal-east': {'busy': []}, 'crew-east': {'busy': [], 'errors': {}}}
        self.assertEqual(m.create(BASE, availability=a)['reason'], 'availability_incomplete')
        self.assertFalse(m.records)

    def test_unsupported_branch(self):
        m = Model(); r = dict(BASE, branch_id='west', calendar_id='cal-west')
        self.assertEqual(m.create(r)['reason'], 'wrong_branch'); self.assertFalse(m.records)

    def test_calendar_unavailable(self):
        m = Model(); self.assertEqual(m.create(BASE, availability={})['state'], 'EXCEPTION_OWNED')
        self.assertFalse(m.records)

    def test_local_time_mismatch(self):
        m = Model(); r = dict(BASE, start='2026-11-02T09:00:00-04:00')
        self.assertEqual(m.create(r)['reason'], 'local_time_mismatch'); self.assertFalse(m.records)

    def test_stale_employee_update(self):
        m = Model(); rid = m.create(BASE)['record_id']; m.records[rid]['version'] = 2
        m.records[rid]['payload']['start'] = '2026-11-02T11:00:00-05:00'
        result = m.change(rid, 1, '2026-11-02T12:00:00-05:00')
        self.assertEqual(result['reason'], 'stale_version')
        self.assertEqual(m.records[rid]['payload']['start'], '2026-11-02T11:00:00-05:00')

    def test_timeout_after_persistence(self):
        m = Model(); a = m.create(BASE, timeout=True); b = m.create(BASE)
        self.assertEqual(a['state'], 'CONFIRMED'); self.assertEqual(a['record_id'], b['record_id'])
        self.assertEqual(len(m.records), 1)
        self.assertIn('WRITE_UNCERTAIN', [x['state'] for x in m.log])

    def test_timeout_unresolved(self):
        m = Model(); result = m.create(BASE, timeout=True, persist=False, reconcile=False)
        self.assertEqual(result['reason'], 'write_unresolved'); self.assertFalse(m.records)
        self.assertNotIn('CONFIRMED', [x['state'] for x in m.log]); self.assertIsNotNone(result['owner'])

    def test_failed_cancellation_during_write(self):
        m = Model(); result = m.create(BASE, timeout=True, cancellation=True, cancel_fails=True)
        self.assertEqual(result['reason'], 'cancellation_pending')
        self.assertTrue(m.records[result['record_id']]['active'])
        self.assertNotIn('CONFIRMED', [x['state'] for x in m.log])

    def test_successful_cancellation_during_write(self):
        m = Model(); result = m.create(BASE, timeout=True, cancellation=True)
        self.assertEqual(result['state'], 'CANCELLED'); self.assertFalse(m.records[result['record_id']]['active'])
        self.assertNotIn('CONFIRMED', [x['state'] for x in m.log])

    def test_permission_denied(self):
        m = Model(); self.assertEqual(m.create(BASE, writable=False)['reason'], 'permission_denied')
        self.assertFalse(m.records)

    def test_wrong_branch_zone(self):
        m = Model(); r = dict(BASE, time_zone='America/Los_Angeles',
                             start='2026-11-02T09:00:00-08:00', end='2026-11-02T10:00:00-08:00')
        self.assertEqual(m.create(r)['reason'], 'wrong_branch_zone'); self.assertFalse(m.records)

    def test_fresh_mutation_unsupported(self):
        m = Model(); rid = m.create(BASE)['record_id']; before = copy.deepcopy(m.records[rid])
        result = m.change(rid, 1, '2026-11-02T12:00:00-05:00')
        self.assertEqual(result['reason'], 'mutation_unsupported')
        self.assertEqual(m.records[rid], before)

    def test_inactive_record_mutation_unsupported(self):
        m = Model(); result = m.create(BASE, cancellation=True); rid = result['record_id']
        before = copy.deepcopy(m.records[rid]); result = m.change(rid, before['version'], BASE['start'])
        self.assertEqual(result['reason'], 'mutation_unsupported')
        self.assertEqual(m.records[rid], before); self.assertFalse(m.records[rid]['active'])

    def test_same_request_changed_payload(self):
        m = Model(); m.create(BASE); changed = dict(BASE, customer_id='cust-002')
        self.assertEqual(m.create(changed)['reason'], 'operation_payload_changed'); self.assertEqual(len(m.records), 1)

if __name__ == '__main__':
    unittest.main(verbosity=2)
