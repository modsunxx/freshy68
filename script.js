document.getElementById('registrationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const studentId = document.getElementById('studentId').value;
  const faculty = document.getElementById('faculty').value;
  const designFile = document.getElementById('design').files[0];
  const successMessage = document.getElementById('successMessage');

  const imgbbApiKey = '75774c37fe8cb9209a4034f89c3560cf';
  const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwINB4wkkC8CAa5m-rrzsXxOs4CR_AXYTZE0L66UxmE4fxpqzlemCrtfCV4568_KD0IMA/exec';

  if (!designFile) {
    alert("กรุณาอัปโหลดไฟล์ดีไซน์ก่อนส่งข้อมูล");
    return;
  }

  try {
    // 👕 อัปโหลดไฟล์ภาพไปยัง ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', designFile);

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: imgbbFormData
    });

    const imgbbData = await imgbbRes.json();
    const designURL = imgbbData.data.url;

    // 📤 ส่งข้อมูลไป Google Sheets
    const data = {
      name,
      studentId,
      faculty,
      designURL
    };

    await fetch(googleScriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // ✅ แสดงข้อความสำเร็จ
    successMessage.textContent = '✅ ข้อมูลถูกส่งเรียบร้อยแล้ว!';
    successMessage.style.display = 'block';

    // รีเซตฟอร์ม
    document.getElementById('registrationForm').reset();

    // ซ่อนข้อความหลัง 5 วินาที
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);

  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err);
    alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง.');
  }
});
