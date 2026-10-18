# คำตอบแลป GitHub Actions + GitHub Pages

**ผู้จัดทำ:** ชวนากร การะบูรณ์ รหัสนิสิต 67160212

- GitHub Repository: https://github.com/67160212-stack/web_dev_lab
- GitHub Pages: https://67160212-stack.github.io/web_dev_lab/

## Exercise 4: Workflow เริ่มเมื่อใด และ Job deploy ทำอะไร

Workflow จะเริ่มทำงานในสองกรณี คือ (1) เมื่อมีการ push ขึ้น branch `main` และ (2) เมื่อกดสั่งรันเองจากแท็บ Actions (`workflow_dispatch`)

Job `deploy` รันบนเครื่อง `ubuntu-latest` และทำงานตามลำดับดังนี้
1. Checkout โค้ดจาก Repository ลงเครื่อง Runner
2. ตรวจว่ามีไฟล์ `index.html`, `style.css`, `script.js` ครบ (ขั้นตอน Challenge) ถ้าขาดไฟล์ใด Workflow จะหยุดและแสดงสถานะ Failed
3. ตั้งค่า GitHub Pages (`configure-pages`)
4. แพ็กไฟล์ทั้งโฟลเดอร์เป็น Artifact (`upload-pages-artifact`)
5. นำ Artifact ไป Deploy ขึ้น GitHub Pages (`deploy-pages`) แล้วแสดง URL ของเว็บไซต์ใน Environment `github-pages`

ถ้ามีการ push ซ้อนกันเร็ว ๆ `concurrency` จะยกเลิกรอบเก่า เพื่อให้ Deploy เฉพาะเวอร์ชันล่าสุด

## คำถามท้ายแลป

**1) GitHub Actions แตกต่างจาก GitHub Pages อย่างไร?**
GitHub Actions เป็นระบบรันงานอัตโนมัติ (CI/CD) เมื่อเกิดเหตุการณ์ เช่น push แล้วรันคำสั่งตาม Workflow ที่เขียนไว้ ส่วน GitHub Pages เป็นบริการ Hosting ที่ให้บริการเว็บ Static ผ่าน URL สาธารณะ ในแลปนี้ Actions เป็นตัวส่งเว็บไปลง Pages และ Pages เป็นที่ที่เว็บอยู่จริง

**2) เหตุใดจึงเลือก trigger ด้วย push ที่ branch main?**
เพราะ `main` เป็น branch หลักที่เก็บโค้ดเวอร์ชันที่พร้อมใช้งาน ถ้า Deploy เฉพาะเมื่อ push ขึ้น `main` เว็บจะอัปเดตทันทีเมื่อมีโค้ดใหม่โดยไม่ต้อง Deploy เอง และงานที่ยังทดลองอยู่ใน branch อื่นจะไม่ขึ้นเว็บจริง

**3) ถ้าแก้ไฟล์ในเครื่องแต่ไม่ได้ push เว็บไซต์จะเปลี่ยนหรือไม่ เพราะเหตุใด?**
ไม่เปลี่ยน เพราะการแก้ไขและ commit อยู่แค่ใน Repository บนเครื่องตัวเอง GitHub ยังไม่ได้รับโค้ดใหม่ จึงไม่มีเหตุการณ์ push ไป trigger Workflow และ Pages ยังแสดง Artifact เวอร์ชันล่าสุดที่ Deploy ไว้

**4) เหตุใดโปรเจกต์ PHP + MySQL จึงไม่สามารถนำไปรันบน GitHub Pages ได้โดยตรง?**
GitHub Pages ให้บริการเฉพาะไฟล์ Static คือส่งไฟล์ HTML/CSS/JS ให้เบราว์เซอร์ตามที่เก็บไว้ ไม่มีตัวประมวลผลฝั่ง Server สำหรับรันโค้ด PHP และไม่มีฐานข้อมูล MySQL ให้เชื่อมต่อ ถ้าต้องใช้ PHP + MySQL จึงต้องใช้ Hosting ที่รองรับ หรือแยกเฉพาะส่วนหน้าเว็บ Static ขึ้น Pages แล้วไปเรียก API จาก Server อื่น

**5) อธิบายขั้นตอนการค้นหาสาเหตุ เมื่อ Workflow มีสถานะ Failed**
1. เปิดแท็บ Actions แล้วเลือกรอบ (run) ที่ Failed
2. เปิด Job `deploy` ดูว่า step ไหนมีเครื่องหมาย ❌ แล้วขยาย Log ของ step นั้นเพื่ออ่านข้อความ Error
3. ตรวจตามชนิดของ Error เช่น
   - YAML ผิด → ตรวจการเยื้อง Space และชื่อ key (`on`, `jobs`, `steps`)
   - Permission/deploy error → ตรวจว่า Settings → Pages → Source เป็น GitHub Actions และมี `pages: write`, `id-token: write`
   - ไฟล์หาย → ตรวจว่ามี `index.html` อยู่ที่ root และ commit ขึ้นไปแล้ว
4. แก้ไขโค้ดบนเครื่อง แล้ว commit และ push ใหม่ (หรือกด Re-run jobs)
5. ตรวจว่ารอบใหม่เป็นสีเขียว แล้วเปิดเว็บเพื่อยืนยัน (Hard Refresh ถ้าจำเป็น)
