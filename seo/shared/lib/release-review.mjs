// Preview may show an owner-authorized proposal; production requires its final
// human review. Never reinterpret automated implementation review as approval.
export function assertReleaseReview(pages, environment) {
  const pending = pages.filter(page => page.review?.releaseApproval === 'pending');
  if (environment === 'production' && pending.length) {
    throw new Error('Owner approval of the exact PR is required before production: ' + pending.map(page => page.slug).join(', '));
  }
}
