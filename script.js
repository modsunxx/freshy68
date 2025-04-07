document.getElementById('registrationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const studentId = document.getElementById('studentId').value;
  const faculty = document.getElementById('faculty').value;
  const designFile = document.getElementById('design').files[0];

  const imgbbApiKey = '75774c37fe8cb9209a4034f89c3560cf'; // 🔁 API key
  const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwINB4wkkC8CAa5m-rrzsXxOs4CR_AXYTZE0L66UxmE4fxpqzlemCrtfCV4568_KD0IMA/exec';

  if (!designFile) {
    alert("Please upload a design file.");
    return;
  }

  try {
    // ✅ ส่งไฟล์ตรงๆ ไป ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', designFile);

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: imgbbFormData
    });

    const imgbbData = await imgbbRes.json();
    const designURL = imgbbData.data.url;

    const data = {
      name,
      studentId,
      faculty,
      designURL
    };

    // ✅ ส่งข้อมูลไป Google Sheet
    await fetch(googleScriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // Show success message
    alert('ส่งสำเร็จ'); // Alert message
    document.getElementById('successMessage').classList.remove('hidden'); // Show hidden success message element
    document.getElementById('registrationForm').reset();
  } catch (err) {
    console.error('Error:', err);
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
  }
});
