document.getElementById('registrationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const studentId = document.getElementById('studentId').value;
  const faculty = document.getElementById('faculty').value;
  const designFile = document.getElementById('design').files[0];

  const imgbbApiKey = '75774c37fe8cb9209a4034f89c3560cf'; // 👈 ใส่ API key ที่นี่
  const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwINB4wkkC8CAa5m-rrzsXxOs4CR_AXYTZE0L66UxmE4fxpqzlemCrtfCV4568_KD0IMA/exec'; // 👈 ใส่ Apps Script URL ที่นี่

  if (!designFile) {
    alert("Please upload a design file.");
    return;
  }

  try {
    // Convert image to Base64
    const base64Image = await toBase64(designFile);

    // Upload to ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64Image.split(',')[1]);

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: imgbbFormData
    });

    const imgbbData = await imgbbRes.json();
    const designURL = imgbbData.data.url;

    // Prepare data for Google Sheet
    const data = {
      name,
      studentId,
      faculty,
      designURL
    };

    // Send data to Google Apps Script
    await fetch(googleScriptURL, {
      method: 'POST',
      mode: 'no-cors', // Important for GAS
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // Show success message
    document.getElementById('successMessage').classList.remove('hidden');
    document.getElementById('registrationForm').reset();

  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong. Please try again.');
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
