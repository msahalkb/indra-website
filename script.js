/* --- Hero Interactive Human Pick & Place Simulation --- */
(function() {
  const canvas = document.getElementById('scan');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rdAngle = document.getElementById('rdAngle');
  const rdPts = document.getElementById('rdPts');

  let placedCount = 0;
  const targetCount = 5;
  
  // Mouse / Touch position tracking
  let mouse = { x: canvas.width / 2, y: canvas.height / 2, active: false };

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    mouse.active = true;
  });

  canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches.length > 0) {
      mouse.x = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
      mouse.y = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height);
      mouse.active = true;
    }
  }, {passive: true});

  let blocks = [
    { x: 120, y: 320, color: '#EAAA00', carried: false, placed: false },
    { x: 180, y: 340, color: '#DDE3E8', carried: false, placed: false },
    { x: 240, y: 310, color: '#3A0F34', carried: false, placed: false },
    { x: 300, y: 350, color: '#EAAA00', carried: false, placed: false },
    { x: 360, y: 325, color: '#DDE3E8', carried: false, placed: false }
  ];

  let armX = canvas.width / 2;
  let armY = canvas.height / 3;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Smooth follow human cursor/touch
    if (mouse.active) {
      armX += (mouse.x - armX) * 0.15;
      armY += (mouse.y - armY) * 0.15;
    } else {
      armX = canvas.width * 0.5 + Math.sin(Date.now() / 1000) * 80;
      armY = canvas.height * 0.4;
    }

    // Draw Drop Target Zone
    ctx.strokeStyle = '#EAAA00';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(canvas.width - 140, canvas.height - 130, 100, 90);
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(234, 170, 0, 0.08)';
    ctx.fillRect(canvas.width - 140, canvas.height - 130, 100, 90);
    ctx.fillStyle = '#EAAA00';
    ctx.font = '12px "IBM Plex Sans", sans-serif';
    ctx.fillText("DROP ZONE (HUMAN)", canvas.width - 140, canvas.height - 140);

    // Draw Blocks & Handle Pickup
    let activeBlockCarried = false;
    blocks.forEach((b, idx) => {
      if (!b.placed) {
        let dist = Math.hypot(armX - b.x, armY - b.y);
        if (dist < 35 && !activeBlockCarried) {
          b.x = armX;
          b.y = armY + 20;
          b.carried = true;
          activeBlockCarried = true;
          
          // Check if dropped in target zone
          if (b.x > canvas.width - 140 && b.x < canvas.width - 40 && b.y > canvas.height - 130 && b.y < canvas.height - 40) {
            b.placed = true;
            b.carried = false;
            placedCount = Math.min(targetCount, placedCount + 1);
          }
        } else if (!activeBlockCarried) {
          b.carried = false;
        }

        ctx.fillStyle = b.color;
        ctx.fillRect(b.x - 15, b.y - 15, 30, 30);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x - 15, b.y - 15, 30, 30);
      } else {
        // Render placed inside zone
        let targetX = canvas.width - 120 + (idx * 16) % 80;
        let targetY = canvas.height - 100 + Math.floor(idx / 5) * 30;
        ctx.fillStyle = b.color;
        ctx.fillRect(targetX, targetY, 24, 24);
      }
    });

    // Draw Human-Controlled Gantry Arm
    ctx.strokeStyle = '#DDE3E8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 20);
    ctx.lineTo(armX, 20);
    ctx.stroke();

    ctx.strokeStyle = '#EAAA00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(armX, 20);
    ctx.lineTo(armX, armY);
    ctx.stroke();

    // Gripper claw
    ctx.fillStyle = '#3A0F34';
    ctx.fillRect(armX - 12, armY, 24, 16);
    ctx.strokeStyle = '#EAAA00';
    ctx.strokeRect(armX - 12, armY, 24, 16);

    // Update Readouts
    if (rdAngle) rdAngle.innerText = `X ${Math.round(armX)}  Y ${Math.round(armY)}  [HUMAN DRIVE]`;
    if (rdPts) rdPts.innerText = `placed ${placedCount}/${targetCount}`;

    // Reset if all placed
    if (placedCount >= targetCount) {
      setTimeout(() => {
        blocks.forEach(b => { b.placed = false; b.x = 80 + Math.random() * 250; b.y = 300 + Math.random() * 50; });
        placedCount = 0;
      }, 1500);
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
