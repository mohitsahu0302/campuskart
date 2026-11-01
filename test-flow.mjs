import assert from 'assert';

const API = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting CampusKart End-to-End Verification...');

  // 1. Health check
  const healthRes = await fetch(`${API}/health`);
  const health = await healthRes.json();
  assert.strictEqual(health.status, 'ok', 'Health check failed');
  console.log('  ✓ 1. Backend health check passed');

  // 2. Fetch seeded listings
  const listRes = await fetch(`${API}/listings?limit=5`);
  const listData = await listRes.json();
  assert.strictEqual(listData.success, true);
  assert(listData.data.items.length > 0, 'No listings returned');
  console.log(`  ✓ 2. Browse listings returned ${listData.data.items.length} items (Total: ${listData.data.pagination.total})`);

  // 3. Search and filter
  const searchRes = await fetch(`${API}/listings?q=CLRS&category=Books`);
  const searchData = await searchRes.json();
  assert.strictEqual(searchData.success, true);
  assert(searchData.data.items.some(i => i.title.includes('CLRS')), 'Search query did not find CLRS');
  console.log('  ✓ 3. Search & Category filter passed');

  // 4. Test Sign up
  const testEmail = `student_${Date.now()}@campus.edu`;
  const signupRes = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Test',
      email: testEmail,
      password: 'mypassword123',
      hostelArea: 'Hostel 4 (C-Block)',
      roomNumber: '402',
      phone: '+91 99999 88888',
      preferredContactMethod: 'whatsapp',
    }),
  });
  const signupData = await signupRes.json();
  assert.strictEqual(signupData.success, true, 'Signup failed');
  const token = signupData.data.token;
  const cookieHeader = signupRes.headers.get('set-cookie');
  console.log('  ✓ 4. Student signup passed with cookie/token');

  // 5. Test session persistence /auth/me
  const meRes = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: cookieHeader || '',
    },
  });
  const meData = await meRes.json();
  assert.strictEqual(meData.success, true);
  assert.strictEqual(meData.data.user.email, testEmail);
  console.log('  ✓ 5. Session survives refresh (/auth/me verified)');

  // 6. Test Image Upload
  const form = new FormData();
  const fakeBlob = new Blob(['image-bytes-data-simulated'], { type: 'image/jpeg' });
  form.append('images', fakeBlob, 'hostel-room-pic.jpg');

  const uploadRes = await fetch(`${API}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const uploadData = await uploadRes.json();
  assert.strictEqual(uploadData.success, true);
  assert(uploadData.data.urls.length > 0, 'No image url returned from upload');
  const uploadedImageUrl = uploadData.data.urls[0];
  console.log(`  ✓ 6. Uploaded image via Multer: ${uploadedImageUrl}`);

  // 7. Create a new listing
  const createRes = await fetch(`${API}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Decathlon Badminton Set with 3 shuttlecocks',
      description: 'Used for one semester. Great string tension. Giving away with nylon shuttles.',
      price: 650,
      category: 'Other',
      condition: 'Good',
      hostelArea: 'Hostel 4 (C-Block)',
      images: [uploadedImageUrl],
      contactMethod: 'whatsapp',
      contactInfo: '+91 99999 88888',
    }),
  });
  const createData = await createRes.json();
  assert.strictEqual(createData.success, true);
  const createdId = createData.data.listing._id;
  console.log(`  ✓ 6. Created listing: "${createData.data.listing.title}" (ID: ${createdId})`);

  // 7. Get listing detail without auth (contact should be masked)
  const pubDetailRes = await fetch(`${API}/listings/${createdId}`);
  const pubDetailData = await pubDetailRes.json();
  assert.strictEqual(pubDetailData.data.listing.contactInfo, null, 'Contact info was NOT masked for anonymous user!');
  console.log('  ✓ 7. Anonymous user cannot view contact info (privacy protected)');

  // 8. Get listing detail WITH auth (contact revealed)
  const authDetailRes = await fetch(`${API}/listings/${createdId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const authDetailData = await authDetailRes.json();
  assert.strictEqual(authDetailData.data.listing.contactInfo, '+91 99999 88888', 'Contact info was not revealed to authenticated student');
  console.log('  ✓ 8. Authenticated student can reveal contact details');

  // 9. Mark listing as SOLD
  const soldRes = await fetch(`${API}/listings/${createdId}/sold`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const soldData = await soldRes.json();
  assert.strictEqual(soldData.success, true);
  assert.strictEqual(soldData.data.listing.status, 'sold');
  console.log('  ✓ 9. Toggled status to SOLD');

  // 10. Update listing
  const updateRes = await fetch(`${API}/listings/${createdId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      price: 550,
    }),
  });
  const updateData = await updateRes.json();
  assert.strictEqual(updateData.success, true);
  assert.strictEqual(updateData.data.listing.price, 550);
  console.log('  ✓ 10. Updated listing price to 550 INR');

  // 11. Wishlist / Saved toggle
  const saveRes = await fetch(`${API}/users/saved/${createdId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const saveData = await saveRes.json();
  assert.strictEqual(saveData.success, true);
  assert.strictEqual(saveData.data.isSaved, true);

  const getSavedRes = await fetch(`${API}/users/saved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const getSavedData = await getSavedRes.json();
  assert.strictEqual(getSavedData.success, true);
  assert(getSavedData.data.savedListings.length > 0);
  console.log('  ✓ 11. Wishlist / Saved items toggle & fetch passed');

  // 12. Delete listing
  const delRes = await fetch(`${API}/listings/${createdId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const delData = await delRes.json();
  assert.strictEqual(delData.success, true);
  console.log('  ✓ 12. Deleted listing successfully');

  // 13. Verify deletion
  const checkDel = await fetch(`${API}/listings/${createdId}`);
  assert.strictEqual(checkDel.status, 404);
  console.log('  ✓ 13. Verified 404 after deletion');

  // 14. Report a listing
  const sampleListingId = listData.data.items[0]._id;
  const reportRes = await fetch(`${API}/listings/${sampleListingId}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reason: 'Wrong Category',
      details: 'This cycle is listed in Other category.',
    }),
  });
  const reportData = await reportRes.json();
  assert.strictEqual(reportData.success, true);
  console.log('  ✓ 14. Report listing endpoint passed');

  console.log('\n🎉 ALL 14 AUTOMATED END-TO-END TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
