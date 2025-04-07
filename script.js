document.getElementById('registrationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const studentId = document.getElementById('studentId').value;
  const faculty = document.getElementById('faculty').value;
  const designFile = document.getElementById('design').files[0];

  const imgbbApiKey = '75774c37fe8cb9209a4034f89c3560cf'; // 🔁 เปลี่ยนตรงนี้
  const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwINB4wkkC8CAa5m-rrzsXxOs4CR_AXYTZE0L66UxmE4fxpqzlemCrtfCV4568_KD0IMA/exec'; // 🔁 และตรงนี้ด้วย

  if (!designFile) {
    alert("Please upload a design file.");
    return;
  }

  try {
    // แปลงไฟล์เป็น base64
    const base64Image = await toBase64(designFile);

    // ✅ ประกาศก่อนใช้!
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64Image.split(',')[1]);

    // อัปโหลดรูปไป ImgBB
    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: imgbbFormData
    });

    const imgbbData = await imgbbRes.json();
    const designURL = imgbbData.data.url;

    // เตรียมข้อมูลสำหรับ Google Sheet
    const data = {
      name,
      studentId,
      faculty,
      designURL
    };

    // ส่งไป Google Apps Script
    await fetch(googleScriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    document.getElementById('successMessage').classList.remove('hidden');
    document.getElementById('registrationForm').reset();
  } catch (err) {
    console.error('Error:', err);
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
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
