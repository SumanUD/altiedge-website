'use client';

import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import Image from 'next/image';
import logo from '../../assets/icons/logo.webp';
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// Define phase fields based on new HTML structure
const PHASES = [
  {
    key: 'personal',
    title: 'Personal Details',
    fields: ['name', 'age', 'gender', 'height', 'weight']
  },
  {
    key: 'heart',
    title: 'Heart Rate Metrics',
    fields: ['restHR', 'maxHR']
  },
  {
    key: 'fitness',
    title: 'Current Fitness Status',
    fields: [
      'workoutDays', 'workoutTime', 'runDist', 'runTime',
      'burpees', 'crunches', 'pushups', 'benchdips', 'pullups', 'squats', 'balanceTime'
    ]
  }
];

// Map input definitions per field
const INPUTS = {
  name: {
    label: 'Full Name',
    type: 'text',
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    help: 'Enter your full name (letters only).'
  },
  age: {
    label: 'Age (years)',
    type: 'number',
    required: true,
    min: 10,
    max: 100,
    step: 1,
    help: 'Age must be between 10 and 100.'
  },
  gender: {
    label: 'Gender',
    type: 'select',
    required: true,
    options: ['male', 'female']
  },
  height: {
    label: 'Height (cm)',
    type: 'number',
    required: true,
    min: 100,
    max: 250,
    step: 1,
    help: 'Measure without shoes, standing upright. Range 100-250 cm.'
  },
  weight: {
    label: 'Weight (kg)',
    type: 'number',
    required: true,
    min: 30,
    max: 250,
    step: 1,
    help: 'Weight must be between 30 and 250 kg.'
  },
  restHR: {
    label: 'Resting HR (bpm)',
    type: 'number',
    required: true,
    min: 30,
    max: 120,
    step: 1,
    help: 'Count heart rate after waking, before activity. Range 30-120 bpm.'
  },
  maxHR: {
    label: 'Max HR (bpm)',
    type: 'number',
    required: true,
    min: 100,
    max: 220,
    step: 1,
    help: 'Max heart rate during intense exercise. Range 100-220 bpm.'
  },
  workoutDays: {
    label: 'Workout days per week',
    type: 'select',
    required: true,
    options: ['1', '2', '3', '4', '5', '6', '7'],
    help: 'Number of days you exercise per week.'
  },
  workoutTime: {
    label: 'Avg Session (mins)',
    type: 'number',
    required: true,
    min: 5,
    max: 300,
    step: 1,
    help: 'Average workout duration in minutes.'
  },
  runDist: {
    label: 'Comfortable Run Distance',
    type: 'select',
    required: true,
    options: ['5', '10', '15', '20', '25'],
    help: 'Distance in km.'
  },
  runTime: {
    label: 'Time for that Distance (mins)',
    type: 'number',
    required: true,
    min: 10,
    max: 300,
    step: 1,
    help: 'Enter time in minutes (between 10 and 300).'
  },
  burpees: {
    label: 'Burpees in 2 min',
    type: 'number',
    required: true,
    min: 0,
    max: 200,
    step: 1,
    help: 'Number of burpees in 2 minutes.'
  },
  crunches: {
    label: 'Crunches in 2 min',
    type: 'number',
    required: true,
    min: 0,
    max: 200,
    step: 1,
    help: 'Number of crunches in 2 minutes.'
  },
  pushups: {
    label: 'Pushups in 2 min',
    type: 'number',
    required: true,
    min: 0,
    max: 200,
    step: 1,
    help: 'Number of pushups in 2 minutes.'
  },
  benchdips: {
    label: 'Bench Dips in 2 min',
    type: 'number',
    required: true,
    min: 0,
    max: 200,
    step: 1,
    help: 'Number of bench dips in 2 minutes.'
  },
  pullups: {
    label: 'Pull Ups in 2 min',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    step: 1,
    help: 'Number of pull ups in 2 minutes.'
  },
  squats: {
    label: 'Bodyweight Squats in 2 min',
    type: 'number',
    required: true,
    min: 0,
    max: 200,
    step: 1,
    help: 'Number of squats in 2 minutes.'
  },
  balanceTime: {
    label: 'Body Balance Test Duration (seconds)',
    type: 'number',
    required: true,
    min: 0,
    max: 1000,
    step: 1,
    help: 'Stand on flat surface, eyes closed, right knee up. Max 1000 seconds.'
  }
};

const initialState = Object.keys(INPUTS).reduce((obj, key) => {
  obj[key] = '';
  return obj;
}, {});

// Calculate results function
function calculateResults(form) {
  const name = form.name || 'Mountaineer';
  const age = parseFloat(form.age) || 0;
  const gender = form.gender || 'male';
  const heightCm = parseFloat(form.height) || 0;
  const weightKg = parseFloat(form.weight) || 0;
  const restHR = parseFloat(form.restHR) || 60;
  const maxHR = parseFloat(form.maxHR) || 180;
  const workoutDays = parseFloat(form.workoutDays) || 3;
  const balanceTime = parseFloat(form.balanceTime) || 30;
  const crunches = parseFloat(form.crunches) || 20;
  const pushups = parseFloat(form.pushups) || 20;
  const benchdips = parseFloat(form.benchdips) || 15;
  const pullups = parseFloat(form.pullups) || 5;
  const squats = parseFloat(form.squats) || 30;
  const burpees = parseFloat(form.burpees) || 15;
  const workoutTime = parseFloat(form.workoutTime) || 45;
  const runDist = parseFloat(form.runDist) || 5;
  const runTime = parseFloat(form.runTime) || 30;

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let bmiSug;
  if (bmi < 18.5) bmiSug = "Underweight. A mass-building protocol is recommended. Ideal BMI is 18.5–24.9.";
  else if (bmi <= 24.9) bmiSug = "Ideal BMI — well positioned for endurance and power-to-weight ratio.";
  else bmiSug = "Overweight. Reducing body composition will improve your ascent efficiency significantly.";
  const bmiPct = Math.min(Math.max(((bmi - 15) / 20) * 100, 2), 98);

  let bmr;
  if (gender === 'male') bmr = 66.4730 + (13.7516 * weightKg) + (5.0033 * heightCm) - (6.7550 * age);
  else bmr = 655.0955 + (9.5634 * weightKg) + (1.8496 * heightCm) - (4.6756 * age);

  let activityFactor;
  if (workoutDays <= 3) activityFactor = 1.375;
  else if (workoutDays <= 5) activityFactor = 1.55;
  else if (workoutDays === 6) activityFactor = 1.725;
  else activityFactor = 1.9;
  const dailyCal = bmr * activityFactor;
  
  let calSug;
  if (bmi < 18.5) calSug = `Consume slightly more than ${Math.round(dailyCal)} kcal daily to build mass for altitude demands.`;
  else if (bmi <= 24.9) calSug = `Maintain ${Math.round(dailyCal)} kcal daily to sustain your current output capacity.`;
  else calSug = `Consume slightly less than ${Math.round(dailyCal)} kcal daily to optimise body composition.`;

  const vo2 = 15 * (maxHR / restHR);
  let vo2Sug;
  if (vo2 >= 60) vo2Sug = "Elite cardiovascular engine. A VO2 Max of 60+ is world-class for high-altitude performance.";
  else if (vo2 >= 50) vo2Sug = "Excellent. Strong capacity for hypoxic stress at altitude.";
  else if (vo2 >= 40) vo2Sug = "Good baseline. Incorporate Zone 2 runs to push this higher before major climbs.";
  else vo2Sug = "Priority area. Improving VO2 Max via interval training is critical for altitude readiness.";
  const vo2Pct = Math.min(vo2 / 65, 1);

  const bmiScore = Math.max(0, Math.min(100, 100 - Math.abs(bmi - 22) * 5));
  const vo2Score = Math.min(100, (vo2 / 65) * 100);
  const ageScore = Math.max(20, Math.min(100, 100 - (age - 20) * 1.5));

  const physiologyScore = (vo2Score * 0.45) + (bmiScore * 0.45) + (ageScore * 0.10);
  const cardioScore = physiologyScore;
  const cardioSug = cardioScore > 80
    ? "Your cardiovascular system is highly conditioned for sustained effort."
    : "Implement more Zone 2 training (60–70% max HR) to build aerobic base.";

  const puScore = Math.min(100, (pushups / 60) * 100);
  const plScore = Math.min(100, (pullups / 20) * 100);
  const dipScore = Math.min(100, (benchdips / 50) * 100);
  const sqScore = Math.min(100, (squats / 80) * 100);
  const strengthScore = (puScore + plScore + dipScore + sqScore) / 4;
  const strengthSug = strengthScore > 75
    ? "Excellent power-to-weight ratio — ideal for technical terrain."
    : "Focus on compound pulls and presses to build climbing-specific strength.";

  const crScore = Math.min(100, (crunches / 60) * 100);
  const balScore = Math.min(100, (balanceTime / 120) * 100);
  const coreScore = (crScore * 0.5) + (balScore * 0.5);
  const coreSug = coreScore > 80
    ? "Solid core — essential for carrying heavy packs on uneven terrain."
    : "Add planks, dead bugs and balance board sessions to your routine.";

  const physicalScore = (cardioScore * 0.33) + (strengthScore * 0.33) + (coreScore * 0.34);
  const physSug = physicalScore > 80
    ? "Your body is well-primed for the physical demands of altitude."
    : "Structured conditioning over 3–6 months will significantly improve your overall readiness.";

  const altiEdgeScore = (physicalScore * 0.70) + (physiologyScore * 0.30);

  let tier, finalSugg, tierColor;
  if (altiEdgeScore >= 85) {
    tier = "Elite"; tierColor = '#90be6d';
    finalSugg = "You are physically and physiologically primed for demanding global peaks — 8000m expeditions are within reach with proper acclimatisation.";
  } else if (altiEdgeScore >= 70) {
    tier = "Strong"; tierColor = '#a8dadc';
    finalSugg = "Solid foundation. With targeted fine-tuning on your weakest metrics, serious altitudes above 6000m are achievable.";
  } else if (altiEdgeScore >= 50) {
    tier = "Developing"; tierColor = '#f26419';
    finalSugg = "Developing capability. Commit 3–6 months to structured conditioning — focus on cardio base and progressive strength loading.";
  } else {
    tier = "Beginner"; tierColor = '#e63946';
    finalSugg = "Beginner stage. Start with daily aerobic activity, core stability work, and bodyweight strength before targeting altitude.";
  }

  return {
    name, age, gender, heightCm, weightKg, restHR, maxHR,
    workoutDays, workoutTime, runDist, runTime,
    burpees, crunches, pushups, benchdips, pullups, squats, balanceTime,
    bmi, bmiPct, bmiSug, bmr, dailyCal, calSug,
    vo2, vo2Pct, vo2Sug, physiologyScore, cardioScore, cardioSug,
    puScore, plScore, dipScore, sqScore, strengthScore, strengthSug,
    crScore, balScore, coreScore, coreSug, physicalScore, physSug,
    altiEdgeScore, tier, tierColor, finalSugg
  };
}

// ==================== UNIVERSAL PDF DOWNLOAD FUNCTION (SAME AS OLD TEST) ====================
const downloadPDF = (pdf) => {
  try {
    pdf.save('altiedge_readiness_report.pdf');
  } catch (error) {
    console.log('Method 1 failed, trying method 2...', error);
    try {
      const pdfDataUri = pdf.output('datauristring');
      const link = document.createElement('a');
      link.href = pdfDataUri;
      link.download = 'altiedge_readiness_report.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error2) {
      console.log('Method 2 failed, trying method 3...', error2);
      const pdfDataUri = pdf.output('datauristring');
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>AltiEdge Report</title></head>
            <body style="margin:0;padding:0;">
              <iframe 
                src="${pdfDataUri}" 
                style="width:100%;height:100vh;border:none;" 
                title="AltiEdge Readiness Report"
              ></iframe>
              <div style="position:fixed;bottom:20px;right:20px;background:#153238;color:white;padding:10px 20px;border-radius:5px;cursor:pointer;" onclick="window.print()">
                📄 Print/Save
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  }
};

// ==================== MAIN COMPONENT ====================
export const Test = () => {
  const [form, setForm] = useState(initialState);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Generate topographic background on mount
  useEffect(() => {
    const buildTopo = () => {
      const svgNS = 'http://www.w3.org/2000/svg';
      const W = window.innerWidth || 1440;
      const H = window.innerHeight || 900;

      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.style.cssText = 'width:100%;height:100%;';

      const defs = document.createElementNS(svgNS, 'defs');
      const bgGrad = document.createElementNS(svgNS, 'linearGradient');
      bgGrad.setAttribute('id', 'bgGrad');
      bgGrad.setAttribute('x1', '0%'); bgGrad.setAttribute('y1', '0%');
      bgGrad.setAttribute('x2', '0%'); bgGrad.setAttribute('y2', '100%');
      [['0%','#0d1117'],['60%','#0e1823'],['100%','#0a1520']].forEach(([o,c])=>{
        const s = document.createElementNS(svgNS,'stop');
        s.setAttribute('offset',o); s.setAttribute('stop-color',c); bgGrad.appendChild(s);
      });
      defs.appendChild(bgGrad);
      svg.appendChild(defs);

      const bg = document.createElementNS(svgNS,'rect');
      bg.setAttribute('width',W); bg.setAttribute('height',H);
      bg.setAttribute('fill','url(#bgGrad)');
      svg.appendChild(bg);

      const peaks = [
        { cx: W * 0.28, cy: H * 0.55, rx: W * 0.55, ry: H * 0.7 },
        { cx: W * 0.72, cy: H * 0.65, rx: W * 0.5, ry: H * 0.6 },
        { cx: W * 0.5, cy: H * 0.45, rx: W * 0.4, ry: H * 0.5 },
      ];

      const numContours = 12;
      peaks.forEach(peak => {
        for (let i = numContours; i >= 1; i--) {
          const factor = i / numContours;
          const rx = peak.rx * factor;
          const ry = peak.ry * factor;
          const cx = peak.cx;
          const cy = peak.cy;

          const pts = [];
          const segs = 48;
          for (let j = 0; j <= segs; j++) {
            const angle = (j / segs) * Math.PI * 2;
            const noise = 1 + (Math.sin(angle * 3.7 + i) * 0.1) + (Math.sin(angle * 7.1 + i * 0.5) * 0.06);
            pts.push({
              x: cx + Math.cos(angle) * rx * noise,
              y: cy + Math.sin(angle) * ry * noise * 0.6
            });
          }

          let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
          for (let j = 1; j <= pts.length; j++) {
            const p = pts[j % pts.length];
            d += ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
          }
          d += ' Z';

          const path = document.createElementNS(svgNS, 'path');
          path.setAttribute('d', d);
          path.setAttribute('fill', 'none');

          const alphaBase = 0.035 + (1 - factor) * 0.04;
          const isKeyLine = (i % 3 === 0);
          const alpha = isKeyLine ? alphaBase * 1.8 : alphaBase;
          const strokeW = isKeyLine ? 1.2 : 0.6;
          path.setAttribute('stroke', `rgba(150,195,210,${alpha.toFixed(3)})`);
          path.setAttribute('stroke-width', strokeW);
          svg.appendChild(path);
        }
      });

      const topoBg = document.getElementById('topoBg');
      if (topoBg) {
        topoBg.innerHTML = '';
        topoBg.appendChild(svg);
      }
    };

    buildTopo();
    window.addEventListener('resize', buildTopo);
    return () => window.removeEventListener('resize', buildTopo);
  }, []);

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const fieldName = name || id;
    setForm(f => ({ ...f, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: null });
    }
  };

  const validateStep = (stepIndex) => {
    const errs = {};
    const fieldsToValidate = PHASES[stepIndex].fields;

    fieldsToValidate.forEach(key => {
      const def = INPUTS[key];
      const value = form[key];

      if (def?.required && (value === '' || value === undefined || value === null)) {
        errs[key] = 'Required';
        return;
      }

      if (def?.type === 'number' && value !== '' && value !== undefined && value !== null) {
        const n = Number(value);
        if (isNaN(n)) {
          errs[key] = 'Must be a number';
          return;
        }
        if (typeof def.min === 'number' && n < def.min) {
          errs[key] = `Must be at least ${def.min}`;
          return;
        }
        if (typeof def.max === 'number' && n > def.max) {
          errs[key] = `Must be at most ${def.max}`;
          return;
        }
      }

      if (def?.type === 'text' && value) {
        if (def.minLength && value.length < def.minLength) {
          errs[key] = `Must be at least ${def.minLength} characters`;
          return;
        }
        if (def.maxLength && value.length > def.maxLength) {
          errs[key] = `Must be at most ${def.maxLength} characters`;
          return;
        }
        if (def.pattern && !def.pattern.test(value)) {
          errs[key] = 'Invalid format';
          return;
        }
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e && e.preventDefault();
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      const card = document.querySelector(`[data-step="${step}"] .glass-card`);
      if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      const calculatedResults = calculateResults(form);
      setResults(calculatedResults);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => animateResults(calculatedResults), 300);
    } else {
      const card = document.querySelector(`[data-step="${step}"] .glass-card`);
      if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
      }
    }
  };

  const handleRecalculate = () => {
    setShowResults(false);
    setStep(0);
    setForm(initialState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const animBar = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(val, 100).toFixed(0) + '%';
  };

  const animateResults = (c) => {
    const circumference = 2 * Math.PI * 85;
    const offset = circumference * (1 - c.altiEdgeScore / 100);
    const radialFill = document.getElementById('radialFill');
    if (radialFill) {
      radialFill.style.strokeDashoffset = offset;
    }

    setTimeout(() => {
      animBar('barPhysical', c.physicalScore);
      animBar('barPhysiology', c.physiologyScore);
      const valPhysical = document.getElementById('valPhysical');
      const valPhysiology = document.getElementById('valPhysiology');
      if (valPhysical) valPhysical.textContent = Math.round(c.physicalScore);
      if (valPhysiology) valPhysiology.textContent = Math.round(c.physiologyScore);
    }, 200);

    setTimeout(() => {
      const bmiMarker = document.getElementById('bmiMarker');
      if (bmiMarker) bmiMarker.style.left = c.bmiPct + '%';
    }, 200);

    const arcTotal = 251.2;
    setTimeout(() => {
      const vo2Arc = document.getElementById('vo2Arc');
      if (vo2Arc) vo2Arc.style.strokeDashoffset = arcTotal * (1 - c.vo2Pct);
    }, 300);

    setTimeout(() => {
      animBar('hbarCardio', c.cardioScore);
      animBar('hbarPhysiology', c.physiologyScore);
      animBar('hbarStrength', c.strengthScore);
      animBar('hbarCore', c.coreScore);
      animBar('hbarPhysical', c.physicalScore);
    }, 400);

    setTimeout(() => {
      document.querySelectorAll('.sub-bar-fill').forEach(el => {
        const dataset = el.dataset || {};
        if (dataset.w) {
          el.style.width = dataset.w + '%';
        }
      });
    }, 500);

    drawRadar([
      { label: 'Cardio', val: c.cardioScore },
      { label: 'Strength', val: c.strengthScore },
      { label: 'Core', val: c.coreScore },
      { label: 'VO2', val: (c.vo2 / 65) * 100 },
      { label: 'Phys', val: c.physiologyScore }
    ]);
  };

  const drawRadar = (metrics) => {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const R = Math.min(cx, cy) - 40;
    const N = metrics.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(202,210,197,0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * (R * r / 4);
        const y = cy + Math.sin(angle) * (R * r / 4);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.strokeStyle = 'rgba(202,210,197,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.beginPath();
    metrics.forEach((m, i) => {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
      const r = (Math.min(m.val, 100) / 100) * R;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    gradient.addColorStop(0, 'rgba(242,100,25,0.35)');
    gradient.addColorStop(1, 'rgba(168,218,220,0.12)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(242,100,25,0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    metrics.forEach((m, i) => {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
      const r = (Math.min(m.val, 100) / 100) * R;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f26419';
      ctx.fill();
    });

    ctx.font = '600 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(202,210,197,0.7)';
    metrics.forEach((m, i) => {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * (R + 22);
      const y = cy + Math.sin(angle) * (R + 22);
      ctx.fillText(m.label, x, y);
    });
  };

  const generatePDF = () => {
    if (isGeneratingPDF || !results) return;
    setIsGeneratingPDF(true);

    try {
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
      const c = results;
      const W = 210;
      const margin = 20;
      const contentW = W - margin * 2;
      let y = 20;

      const darkBg = [13, 17, 23];
      const cardBg = [20, 30, 38];
      const orange = [242, 100, 25];
      const white = [240, 244, 248];
      const dimText = [140, 155, 160];
      const iceBlue = [202, 210, 197];

      pdf.setFillColor(...darkBg);
      pdf.rect(0, 0, W, 297, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(...white);
      pdf.text('AltiEdge Readiness Profile', W / 2, y, { align: 'center' });
      y += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(...orange);
      pdf.text(`${c.name}'s Report`, W / 2, y, { align: 'center' });
      y += 4;
      pdf.setFontSize(8);
      pdf.setTextColor(...dimText);
      pdf.text(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), W / 2, y, { align: 'center' });
      y += 10;

      pdf.setFillColor(...cardBg);
      pdf.roundedRect(margin, y, contentW, 36, 4, 4, 'F');
      pdf.setFontSize(11);
      pdf.setTextColor(...dimText);
      pdf.text('OVERALL ALTIEDGE SCORE', margin + 8, y + 8);
      pdf.setFontSize(32);
      pdf.setTextColor(...orange);
      pdf.text(Math.round(c.altiEdgeScore).toString(), margin + 8, y + 26);
      pdf.setFontSize(14);
      pdf.setTextColor(...dimText);
      pdf.text('/ 100', margin + 32, y + 26);
      pdf.setFontSize(10);
      pdf.setTextColor(...iceBlue);
      pdf.text(c.tier + ' Climber', margin + contentW - 8, y + 14, { align: 'right' });
      pdf.setFontSize(8);
      pdf.setTextColor(...dimText);
      const summaryLines = pdf.splitTextToSize(c.finalSugg, contentW / 2 + 20);
      pdf.text(summaryLines, margin + 60, y + 20);
      y += 42;

      const sectionTitle = (title) => {
        pdf.setFontSize(8);
        pdf.setTextColor(...dimText);
        pdf.text(title.toUpperCase(), margin, y);
        pdf.setDrawColor(40, 50, 60);
        pdf.line(margin, y + 1.5, W - margin, y + 1.5);
        y += 7;
      };

      const scoreRow = (label, value, suggestion, barColor) => {
        pdf.setFillColor(...cardBg);
        pdf.roundedRect(margin, y, contentW, suggestion ? 18 : 12, 3, 3, 'F');

        pdf.setFontSize(9);
        pdf.setTextColor(...iceBlue);
        pdf.text(label, margin + 5, y + 6);

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...(barColor || orange));
        pdf.text(typeof value === 'number' ? Math.round(value).toString() : value, margin + contentW - 5, y + 7, { align: 'right' });

        const barX = margin + 75;
        const barW = contentW - 100;
        pdf.setFillColor(40, 50, 60);
        pdf.roundedRect(barX, y + 3.5, barW, 3, 1.5, 1.5, 'F');
        pdf.setFillColor(...(barColor || orange));
        const fill = typeof value === 'number' ? Math.min(value, 100) : 0;
        pdf.roundedRect(barX, y + 3.5, barW * (fill / 100), 3, 1.5, 1.5, 'F');

        if (suggestion) {
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...dimText);
          pdf.text(pdf.splitTextToSize(suggestion, contentW - 12)[0], margin + 5, y + 14);
        }

        y += suggestion ? 21 : 15;
        pdf.setFont('helvetica', 'normal');
      };

      sectionTitle('Body Metrics');

      pdf.setFillColor(...cardBg);
      pdf.roundedRect(margin, y, contentW / 2 - 3, 26, 3, 3, 'F');
      pdf.roundedRect(margin + contentW / 2 + 3, y, contentW / 2 - 3, 26, 3, 3, 'F');

      pdf.setFontSize(7);
      pdf.setTextColor(...dimText);
      pdf.text('BMI', margin + 5, y + 6);
      pdf.setFontSize(18);
      pdf.setTextColor(...white);
      pdf.setFont('helvetica', 'bold');
      pdf.text(c.bmi.toFixed(1), margin + 5, y + 16);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.setTextColor(...dimText);
      pdf.text(pdf.splitTextToSize(c.bmiSug, contentW / 2 - 16)[0], margin + 5, y + 22);

      const rightX = margin + contentW / 2 + 8;
      pdf.setFontSize(7);
      pdf.setTextColor(...dimText);
      pdf.text('VO2 MAX', rightX, y + 6);
      pdf.setFontSize(18);
      pdf.setTextColor(...white);
      pdf.setFont('helvetica', 'bold');
      pdf.text(c.vo2.toFixed(1), rightX, y + 16);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.setTextColor(...dimText);
      pdf.text(pdf.splitTextToSize(c.vo2Sug, contentW / 2 - 16)[0], rightX, y + 22);
      y += 30;

      pdf.setFillColor(...cardBg);
      pdf.roundedRect(margin, y, contentW, 14, 3, 3, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(...dimText);
      pdf.text('BMR:', margin + 5, y + 6);
      pdf.setTextColor(...white);
      pdf.setFont('helvetica', 'bold');
      pdf.text(Math.round(c.bmr).toLocaleString() + ' kcal/day', margin + 18, y + 6);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...dimText);
      pdf.text('Daily Calorie Target:', margin + 70, y + 6);
      pdf.setTextColor(...orange);
      pdf.setFont('helvetica', 'bold');
      pdf.text(Math.round(c.dailyCal).toLocaleString() + ' kcal/day', margin + 108, y + 6);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.setTextColor(...dimText);
      pdf.text(pdf.splitTextToSize(c.calSug, contentW - 12)[0], margin + 5, y + 11.5);
      y += 18;

      sectionTitle('Fitness Scores');
      scoreRow('Cardiovascular Fitness', c.cardioScore, c.cardioSug);
      scoreRow('Physiology & Biomarker', c.physiologyScore, null, iceBlue);
      scoreRow('Muscular Strength', c.strengthScore, c.strengthSug);
      scoreRow('Core Strength & Stability', c.coreScore, c.coreSug, iceBlue);
      scoreRow('Physical Fitness Readiness', c.physicalScore, c.physSug);

      pdf.addPage();
      pdf.setFillColor(...darkBg);
      pdf.rect(0, 0, W, 297, 'F');
      y = 20;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(...white);
      pdf.text('Original Inputs', W / 2, y, { align: 'center' });
      y += 4;
      pdf.setFontSize(8);
      pdf.setTextColor(...dimText);
      pdf.text('Data provided for the readiness assessment', W / 2, y, { align: 'center' });
      y += 10;

      const inputSection = (title, rows) => {
        pdf.setFontSize(9);
        pdf.setTextColor(...orange);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin, y);
        y += 2;
        pdf.setDrawColor(40, 50, 60);
        pdf.line(margin, y, W - margin, y);
        y += 5;

        pdf.setFillColor(...cardBg);
        const cardH = rows.length * 9 + 6;
        pdf.roundedRect(margin, y, contentW, cardH, 3, 3, 'F');

        pdf.setFont('helvetica', 'normal');
        rows.forEach(([label, val], idx) => {
          const rowY = y + 6 + idx * 9;
          if (idx % 2 === 0) {
            pdf.setFillColor(25, 35, 45);
            pdf.rect(margin + 1, rowY - 3.5, contentW - 2, 9, 'F');
          }
          pdf.setFontSize(8.5);
          pdf.setTextColor(...iceBlue);
          pdf.text(label, margin + 6, rowY);
          pdf.setTextColor(...white);
          pdf.setFont('helvetica', 'bold');
          pdf.text(String(val), margin + contentW - 6, rowY, { align: 'right' });
          pdf.setFont('helvetica', 'normal');
        });

        y += cardH + 8;
      };

      inputSection('Personal Details', [
        ['Full Name', c.name],
        ['Age', c.age + ' years'],
        ['Gender', c.gender === 'male' ? 'Male' : 'Female'],
        ['Height', c.heightCm + ' cm'],
        ['Weight', c.weightKg + ' kg'],
      ]);

      inputSection('Heart Rate Metrics', [
        ['Resting Heart Rate', c.restHR + ' bpm'],
        ['Maximum Heart Rate', c.maxHR + ' bpm'],
      ]);

      inputSection('Workout Habits', [
        ['Workout Days / Week', c.workoutDays + ' days'],
        ['Average Session', c.workoutTime + ' mins'],
        ['Comfortable Run Distance', c.runDist + ' km'],
        ['Time for Run Distance', c.runTime + ' mins'],
      ]);

      inputSection('Strength & Endurance (reps in 2 min)', [
        ['Burpees', c.burpees],
        ['Crunches', c.crunches],
        ['Pushups', c.pushups],
        ['Bench Dips', c.benchdips],
        ['Pull Ups', c.pullups],
        ['Bodyweight Squats', c.squats],
      ]);

      inputSection('Core Balance', [
        ['Body Balance Test Duration', c.balanceTime + ' seconds'],
      ]);

      [1, 2].forEach(pg => {
        pdf.setPage(pg);
        pdf.setFontSize(7);
        pdf.setTextColor(80, 90, 100);
        pdf.text('AltiEdge Readiness Test — Proprietary Assessment', W / 2, 290, { align: 'center' });
        pdf.text('www.altiedge.com', W / 2, 294, { align: 'center' });
      });

      const cleanName = (c.name || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`AltiEdge_Report_${cleanName}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('There was an error generating your report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const progressWidth = step === 0 ? '33%' : step === 1 ? '67%' : '100%';
  const progressLabelText = `Step ${step + 1} of 3`;

  return (
    <>
      <div className="topo-bg" id="topoBg"></div>
      <div className="topo-overlay"></div>

      <div className="container">
        <header>
          <div className="logo-wrap">
            <Image src={logo} alt="AltiEdge" className="logo-icon" width={48} height={48} />
            <h1 className="logo-text">AltiEdge</h1>
          </div>
          <p className="tagline">Readiness Test</p>
          <p className="subtitle">Assess your physical fitness and climbing readiness with our proprietary metrics.</p>
        </header>

        <main>
          <section className={`form-section ${showResults ? 'hidden' : ''}`} id="formSection">
            <form onSubmit={step === 2 ? handleSubmit : handleNext}>
              <div className="progress-wrap">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: progressWidth }}></div>
                </div>
                <span className="progress-label">{progressLabelText}</span>
              </div>

              {/* Step 1: Personal Details */}
              <div className={`form-step ${step === 0 ? 'active' : ''}`} data-step="0">
                <div className="glass-card">
                  <div className="step-header">
                    <span className="step-number">01</span>
                    <div>
                      <h3>Personal Details</h3>
                      <p className="step-desc">Your baseline biometric information.</p>
                    </div>
                  </div>
                  <div className="input-group full-width">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={form.name || ''}
                      onChange={handleChange}
                      placeholder="Mountaineer" 
                      autoComplete="off"
                      style={{ borderColor: errors.name ? '#e63946' : '' }}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="age">Age (years)</label>
                      <input 
                        type="number" 
                        id="age" 
                        name="age"
                        value={form.age || ''}
                        onChange={handleChange}
                        min="10" 
                        max="100" 
                        placeholder="e.g. 30"
                        style={{ borderColor: errors.age ? '#e63946' : '' }}
                      />
                      {errors.age && <span className="error-text">{errors.age}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="gender">Gender</label>
                      <select 
                        id="gender" 
                        name="gender"
                        value={form.gender || ''}
                        onChange={handleChange}
                        style={{ borderColor: errors.gender ? '#e63946' : '' }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && <span className="error-text">{errors.gender}</span>}
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="height">Height (cm)</label>
                      <input 
                        type="number" 
                        id="height" 
                        name="height"
                        value={form.height || ''}
                        onChange={handleChange}
                        min="100" 
                        max="250" 
                        placeholder="e.g. 175"
                        style={{ borderColor: errors.height ? '#e63946' : '' }}
                      />
                      {errors.height && <span className="error-text">{errors.height}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="weight">Weight (kg)</label>
                      <input 
                        type="number" 
                        id="weight" 
                        name="weight"
                        value={form.weight || ''}
                        onChange={handleChange}
                        min="30" 
                        max="250" 
                        placeholder="e.g. 70"
                        style={{ borderColor: errors.weight ? '#e63946' : '' }}
                      />
                      {errors.weight && <span className="error-text">{errors.weight}</span>}
                    </div>
                  </div>
                </div>
                <div className="step-nav">
                  <button type="button" className="btn-next" onClick={handleNext}>Next →</button>
                </div>
              </div>

              {/* Step 2: Heart Rate Metrics */}
              <div className={`form-step ${step === 1 ? 'active' : ''}`} data-step="1">
                <div className="glass-card">
                  <div className="step-header">
                    <span className="step-number">02</span>
                    <div>
                      <h3>Heart Rate Metrics</h3>
                      <p className="step-desc">Your cardiovascular baseline readings.</p>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="restHR">Resting HR (bpm)</label>
                      <input 
                        type="number" 
                        id="restHR" 
                        name="restHR"
                        value={form.restHR || ''}
                        onChange={handleChange}
                        min="30" 
                        max="120" 
                        placeholder="e.g. 60"
                        style={{ borderColor: errors.restHR ? '#e63946' : '' }}
                      />
                      {errors.restHR && <span className="error-text">{errors.restHR}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="maxHR">Max HR (bpm)</label>
                      <input 
                        type="number" 
                        id="maxHR" 
                        name="maxHR"
                        value={form.maxHR || ''}
                        onChange={handleChange}
                        min="100" 
                        max="220" 
                        placeholder="e.g. 185"
                        style={{ borderColor: errors.maxHR ? '#e63946' : '' }}
                      />
                      {errors.maxHR && <span className="error-text">{errors.maxHR}</span>}
                    </div>
                  </div>
                </div>
                <div className="step-nav">
                  <button type="button" className="btn-back" onClick={handleBack}>← Back</button>
                  <button type="button" className="btn-next" onClick={handleNext}>Next →</button>
                </div>
              </div>

              {/* Step 3: Current Fitness Status */}
              <div className={`form-step ${step === 2 ? 'active' : ''}`} data-step="2">
                <div className="glass-card">
                  <div className="step-header">
                    <span className="step-number">03</span>
                    <div>
                      <h3>Current Fitness Status</h3>
                      <p className="step-desc">Your training habits, strength benchmarks and stability.</p>
                    </div>
                  </div>

                  <p className="sub-section-label">Workout Habits</p>
                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="workoutDays">Workout days per week</label>
                      <select 
                        id="workoutDays" 
                        name="workoutDays"
                        value={form.workoutDays || ''}
                        onChange={handleChange}
                        style={{ borderColor: errors.workoutDays ? '#e63946' : '' }}
                      >
                        <option value="" disabled>Select Days</option>
                        <option value="1">1 day</option>
                        <option value="2">2 days</option>
                        <option value="3">3 days</option>
                        <option value="4">4 days</option>
                        <option value="5">5 days</option>
                        <option value="6">6 days</option>
                        <option value="7">7 days</option>
                      </select>
                      {errors.workoutDays && <span className="error-text">{errors.workoutDays}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="workoutTime">Avg Session (mins)</label>
                      <input 
                        type="number" 
                        id="workoutTime" 
                        name="workoutTime"
                        value={form.workoutTime || ''}
                        onChange={handleChange}
                        min="5" 
                        max="300" 
                        placeholder="e.g. 45"
                        style={{ borderColor: errors.workoutTime ? '#e63946' : '' }}
                      />
                      {errors.workoutTime && <span className="error-text">{errors.workoutTime}</span>}
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="runDist">Comfortable Run Distance</label>
                      <select 
                        id="runDist" 
                        name="runDist"
                        value={form.runDist || ''}
                        onChange={handleChange}
                        style={{ borderColor: errors.runDist ? '#e63946' : '' }}
                      >
                        <option value="" disabled>Select Distance</option>
                        <option value="5">5 Km</option>
                        <option value="10">10 Km</option>
                        <option value="15">15 Km</option>
                        <option value="20">20 Km</option>
                        <option value="25">25 Km</option>
                      </select>
                      {errors.runDist && <span className="error-text">{errors.runDist}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="runTime">Time for that Distance (mins)</label>
                      <input 
                        type="number" 
                        id="runTime" 
                        name="runTime"
                        value={form.runTime || ''}
                        onChange={handleChange}
                        min="10" 
                        max="300" 
                        placeholder="e.g. 60"
                        style={{ borderColor: errors.runTime ? '#e63946' : '' }}
                      />
                      {errors.runTime && <span className="error-text">{errors.runTime}</span>}
                    </div>
                  </div>

                  <p className="sub-section-label">Strength & Endurance <span className="sub-section-hint">(reps in 2 minutes)</span></p>
                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="burpees">Burpees</label>
                      <input 
                        type="number" 
                        id="burpees" 
                        name="burpees"
                        value={form.burpees || ''}
                        onChange={handleChange}
                        min="0" 
                        max="200" 
                        placeholder="count"
                        style={{ borderColor: errors.burpees ? '#e63946' : '' }}
                      />
                      {errors.burpees && <span className="error-text">{errors.burpees}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="crunches">Crunches</label>
                      <input 
                        type="number" 
                        id="crunches" 
                        name="crunches"
                        value={form.crunches || ''}
                        onChange={handleChange}
                        min="0" 
                        max="200" 
                        placeholder="count"
                        style={{ borderColor: errors.crunches ? '#e63946' : '' }}
                      />
                      {errors.crunches && <span className="error-text">{errors.crunches}</span>}
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="pushups">Pushups</label>
                      <input 
                        type="number" 
                        id="pushups" 
                        name="pushups"
                        value={form.pushups || ''}
                        onChange={handleChange}
                        min="0" 
                        max="200" 
                        placeholder="count"
                        style={{ borderColor: errors.pushups ? '#e63946' : '' }}
                      />
                      {errors.pushups && <span className="error-text">{errors.pushups}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="benchdips">Bench Dips</label>
                      <input 
                        type="number" 
                        id="benchdips" 
                        name="benchdips"
                        value={form.benchdips || ''}
                        onChange={handleChange}
                        min="0" 
                        max="200" 
                        placeholder="count"
                        style={{ borderColor: errors.benchdips ? '#e63946' : '' }}
                      />
                      {errors.benchdips && <span className="error-text">{errors.benchdips}</span>}
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="pullups">Pull Ups</label>
                      <input 
                        type="number" 
                        id="pullups" 
                        name="pullups"
                        value={form.pullups || ''}
                        onChange={handleChange}
                        min="0" 
                        max="100" 
                        placeholder="count"
                        style={{ borderColor: errors.pullups ? '#e63946' : '' }}
                      />
                      {errors.pullups && <span className="error-text">{errors.pullups}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="squats">Bodyweight Squats</label>
                      <input 
                        type="number" 
                        id="squats" 
                        name="squats"
                        value={form.squats || ''}
                        onChange={handleChange}
                        min="0" 
                        max="200" 
                        placeholder="count"
                        style={{ borderColor: errors.squats ? '#e63946' : '' }}
                      />
                      {errors.squats && <span className="error-text">{errors.squats}</span>}
                    </div>
                  </div>

                  <p className="sub-section-label">Core Balance</p>
                  <div className="input-group full-width">
                    <label htmlFor="balanceTime">Body Balance Test Duration (seconds)</label>
                    <input 
                      type="number" 
                      id="balanceTime" 
                      name="balanceTime"
                      value={form.balanceTime || ''}
                      onChange={handleChange}
                      min="0" 
                      max="1000" 
                      placeholder="e.g. 60"
                      style={{ borderColor: errors.balanceTime ? '#e63946' : '' }}
                    />
                    {errors.balanceTime && <span className="error-text">{errors.balanceTime}</span>}
                  </div>
                </div>
                <div className="step-nav">
                  <button type="button" className="btn-back" onClick={handleBack}>← Back</button>
                  <button type="submit" className="btn-submit">Calculate My Readiness ↑</button>
                </div>
              </div>
            </form>
          </section>

          {/* RESULTS DASHBOARD */}
          <section className={`results-section ${showResults ? '' : 'hidden'}`} id="resultsDashboard">
            {results && (
              <>
                <div className="results-header">
                  <Image src={logo} alt="AltiEdge" className="results-logo" width={64} height={64} />
                  <p className="results-name" id="resName">{results.name}'s</p>
                  <h2>AltiEdge Readiness Profile</h2>
                </div>

                <div className="hero-score-card glass-card">
                  <div className="hero-score-left">
                    <p className="label">Overall AltiEdge Score</p>
                    <div className="radial-wrap">
                      <svg className="radial-chart" viewBox="0 0 200 200">
                        <defs>
                          <linearGradient id="radialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={results.tierColor} />
                            <stop offset="100%" stopColor="#f26419" />
                          </linearGradient>
                        </defs>
                        <circle cx="100" cy="100" r="85" className="radial-track" />
                        <circle cx="100" cy="100" r="85" className="radial-fill" id="radialFill"
                          strokeDasharray="534" strokeDashoffset="534" style={{ stroke: 'url(#radialGrad)' }} />
                      </svg>
                      <div className="radial-text-overlay">
                        <span className="radial-score-text" id="resAltiEdge">{Math.round(results.altiEdgeScore)}</span>
                        <span className="radial-sub-text">/ 100</span>
                      </div>
                    </div>
                    <div className="score-tier" id="scoreTier" style={{ 
                      background: `rgba(${parseInt(results.tierColor.slice(1,3),16)},${parseInt(results.tierColor.slice(3,5),16)},${parseInt(results.tierColor.slice(5,7),16)},0.15)`,
                      color: results.tierColor,
                      borderColor: `rgba(${parseInt(results.tierColor.slice(1,3),16)},${parseInt(results.tierColor.slice(3,5),16)},${parseInt(results.tierColor.slice(5,7),16)},0.3)`
                    }}>
                      {results.tier} Climber
                    </div>
                  </div>
                  <div className="hero-score-right">
                    <p className="label">Summary</p>
                    <p className="hero-suggestion" id="sugAltiEdge">{results.finalSugg}</p>
                    <div className="score-breakdown">
                      <div className="breakdown-item">
                        <span className="breakdown-label">Physical Fitness</span>
                        <div className="mini-bar-wrap"><div className="mini-bar" id="barPhysical" style={{ width: '0%' }}></div></div>
                        <span className="breakdown-val" id="valPhysical">{Math.round(results.physicalScore)}</span>
                      </div>
                      <div className="breakdown-item">
                        <span className="breakdown-label">Physiology & Biomarker</span>
                        <div className="mini-bar-wrap"><div className="mini-bar orange" id="barPhysiology" style={{ width: '0%' }}></div></div>
                        <span className="breakdown-val" id="valPhysiology">{Math.round(results.physiologyScore)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="section-title">Body Metrics</h3>
                <div className="metric-row">
                  <div className="glass-card metric-vcard">
                    <p className="mlabel">BMI</p>
                    <div className="mbig" id="resBMI">{results.bmi.toFixed(1)}</div>
                    <div className="bmi-scale">
                      <div className="bmi-bar-track">
                        <div className="bmi-marker" id="bmiMarker" style={{ left: '50%' }}></div>
                        <span className="bmi-zone under">Under</span>
                        <span className="bmi-zone ideal">Ideal</span>
                        <span className="bmi-zone over">Over</span>
                      </div>
                    </div>
                    <p className="msugg" id="sugBMI">{results.bmiSug}</p>
                  </div>
                  <div className="glass-card metric-vcard">
                    <p className="mlabel">BMR</p>
                    <div className="mbig"><span id="resBMR">{Math.round(results.bmr).toLocaleString()}</span></div>
                    <p className="munit">kcal / day</p>
                    <p className="mlabel mt">Daily Calorie Target</p>
                    <div className="mbig orange-text"><span id="resCalories">{Math.round(results.dailyCal).toLocaleString()}</span></div>
                    <p className="munit">kcal / day</p>
                    <p className="msugg" id="sugCalories">{results.calSug}</p>
                  </div>
                  <div className="glass-card metric-vcard">
                    <p className="mlabel">VO2 Max</p>
                    <div className="mbig" id="resVO2">{results.vo2.toFixed(1)}</div>
                    <div className="vo2-gauge">
                      <svg viewBox="0 0 200 110" className="gauge-svg">
                        <defs>
                          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#e63946"/>
                            <stop offset="50%" stopColor="#f26419"/>
                            <stop offset="100%" stopColor="#a8dadc"/>
                          </linearGradient>
                        </defs>
                        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" strokeLinecap="round"/>
                        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGrad)" strokeWidth="16" strokeLinecap="round"
                              strokeDasharray="251.2" strokeDashoffset="251.2" id="vo2Arc" style={{ strokeDashoffset: 251.2 }} />
                      </svg>
                      <div className="gauge-labels">
                        <span>0</span><span>65+</span>
                      </div>
                    </div>
                    <p className="msugg" id="sugVO2">{results.vo2Sug}</p>
                  </div>
                </div>

                <h3 className="section-title">Fitness Scores</h3>
                <div className="fitness-grid">
                  <div className="glass-card fitness-card">
                    <div className="fitness-header">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f26419" strokeWidth="2">
                        <path d="M3 12l2-2 4 4 4-8 4 6 2-2"/>
                      </svg>
                      <h4>Cardiovascular Fitness</h4>
                    </div>
                    <div className="bar-score-row">
                      <div className="score-pill" id="resCardio">{Math.round(results.cardioScore)}</div>
                      <div className="h-bar-track"><div className="h-bar orange" id="hbarCardio" style={{ width: '0%' }}></div></div>
                    </div>
                    <p className="msugg" id="sugCardio">{results.cardioSug}</p>
                  </div>

                  <div className="glass-card fitness-card">
                    <div className="fitness-header">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15333c" strokeWidth="2">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                      <h4>Physiology & Biomarker</h4>
                    </div>
                    <div className="bar-score-row">
                      <div className="score-pill ice" id="resPhysiology">{Math.round(results.physiologyScore)}</div>
                      <div className="h-bar-track"><div className="h-bar ice" id="hbarPhysiology" style={{ width: '0%' }}></div></div>
                    </div>
                  </div>

                  <div className="glass-card fitness-card">
                    <div className="fitness-header">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f26419" strokeWidth="2">
                        <path d="M6 4v6m12-6v6M4 10h16M4 14h16m-2 4v-4M6 18v-4"/>
                      </svg>
                      <h4>Muscular Strength & Endurance</h4>
                    </div>
                    <div className="bar-score-row">
                      <div className="score-pill" id="resStrength">{Math.round(results.strengthScore)}</div>
                      <div className="h-bar-track"><div className="h-bar orange" id="hbarStrength" style={{ width: '0%' }}></div></div>
                    </div>
                    <div className="sub-bar-grid" id="exerciseBars">
                      <div className="sub-bar-item">
                        <span className="sub-bar-label">Pushups</span>
                        <div className="sub-bar-track"><div className="sub-bar-fill" data-w={results.puScore.toFixed(1)} style={{ width: '0%' }}></div></div>
                      </div>
                      <div className="sub-bar-item">
                        <span className="sub-bar-label">Pull Ups</span>
                        <div className="sub-bar-track"><div className="sub-bar-fill" data-w={results.plScore.toFixed(1)} style={{ width: '0%' }}></div></div>
                      </div>
                      <div className="sub-bar-item">
                        <span className="sub-bar-label">Bench Dips</span>
                        <div className="sub-bar-track"><div className="sub-bar-fill" data-w={results.dipScore.toFixed(1)} style={{ width: '0%' }}></div></div>
                      </div>
                      <div className="sub-bar-item">
                        <span className="sub-bar-label">Squats</span>
                        <div className="sub-bar-track"><div className="sub-bar-fill" data-w={results.sqScore.toFixed(1)} style={{ width: '0%' }}></div></div>
                      </div>
                    </div>
                    <p className="msugg" id="sugStrength">{results.strengthSug}</p>
                  </div>

                  <div className="glass-card fitness-card">
                    <div className="fitness-header">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15333c" strokeWidth="2">
                        <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      <h4>Core Strength & Stability</h4>
                    </div>
                    <div className="bar-score-row" style={{border:"0.5px solid #15333c"}}>
                      <div className="score-pill ice" id="resCore">{Math.round(results.coreScore)}</div>
                      <div className="h-bar-track"><div className="h-bar ice" id="hbarCore" style={{ width: '0%' }}></div></div>
                    </div>
                    <p className="msugg" id="sugCore">{results.coreSug}</p>
                  </div>

                  <div className="glass-card fitness-card wide">
                    <div className="fitness-header">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f26419" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <h4>Physical Fitness Readiness</h4>
                    </div>
                    <div className="bar-score-row">
                      <div className="score-pill" id="resPhysical">{Math.round(results.physicalScore)}</div>
                      <div className="h-bar-track"><div className="h-bar orange" id="hbarPhysical" style={{ width: '0%' }}></div></div>
                    </div>
                    <div className="radar-container">
                      <canvas id="radarChart" width="300" height="300"></canvas>
                    </div>
                    <p className="msugg" id="sugPhysical">{results.physSug}</p>
                  </div>
                </div>

                <div className="results-actions">
                  <button id="recalculateBtn" className="btn-recalc" onClick={handleRecalculate}>↻ Recalculate</button>
                  <button 
                    id="downloadBtn" 
                    className="btn-download" 
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? 'Generating PDF...' : '↓ Download Report PDF'}
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
      </div>

      <style jsx>{`
        :root {
          --slate-grey: #2f3e46;
          --ice-blue: #cad2c5;
          --ice-blue-dim: rgba(202, 210, 197, 0.15);
          --alpine-white: #f0f4f8;
          --signal-orange: #f26419;
          --orange-glow: rgba(242, 100, 25, 0.35);
          --dark-bg: #0d1117;
          --glass-bg: rgba(20, 30, 38, 0.65);
          --glass-border: rgba(202, 210, 197, 0.12);
          --glass-border-hover: rgba(202, 210, 197, 0.3);
          --text-primary: #f0f4f8;
          --text-secondary: rgba(202, 210, 197, 0.7);
          --text-dim: rgba(202, 210, 197, 0.4);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .container {
          position: relative;
          z-index: 2;
          max-width: 960px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        header {
          text-align: center;
          margin-bottom: 50px;
        }

        .logo-wrap {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .logo-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          object-fit: contain;
          filter: drop-shadow(0 0 8px rgba(242, 100, 25, 0.4));
        }

        .logo-text {
          font-size: 2.8rem;
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
          background:  #14333d;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tagline {
          font-size: 1rem;
          color: var(--signal-orange);
          text-transform: uppercase;
          letter-spacing: 3px;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 520px;
          margin: 0 auto;
          font-weight: 300;
        }

        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(24px) saturate(150%);
          -webkit-backdrop-filter: blur(24px) saturate(150%);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3), 0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: border-color 0.3s ease;
        }

        .glass-card:hover {
          border-color: var(--glass-border-hover);
        }

        .progress-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }

        .progress-bar {
          flex: 1;
          height: 4px;
          background: var(--ice-blue-dim);
          border-radius: 99px;
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--signal-orange), #ffa040);
          border-radius: 99px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .progress-label {
          font-size: 0.8rem;
          color: var(--text-dim);
          white-space: nowrap;
          letter-spacing: 0.5px;
        }

        .form-step { display: none; }
        .form-step.active { display: block; }

        .step-header {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--glass-border);
        }

        .step-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--signal-orange);
          opacity: 0.7;
          line-height: 1;
          flex-shrink: 0;
          min-width: 48px;
        }

        .step-header h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--alpine-white);
          margin-bottom: 4px;
        }

        .step-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          font-weight: 300;
        }

        .sub-section-label {
          font-size: 0.78rem;
          color: var(--signal-orange);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 14px;
          padding-top: 18px;
          border-top: 1px solid var(--glass-border);
        }

        .sub-section-label:first-of-type {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }

        .sub-section-hint {
          font-weight: 400;
          color: var(--text-dim);
          text-transform: none;
          letter-spacing: normal;
          font-size: 0.75rem;
        }

        .input-row {
          display: flex;
          gap: 18px;
          margin-bottom: 16px;
        }

        .input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .input-group.full-width {
          width: 100%;
          margin-bottom: 16px;
        }

        label {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          font-weight: 500;
        }

        input, select {
          background: rgba(8, 14, 20, 0.7);
          border: 1px solid rgba(202, 210, 197, 0.18);
          color: var(--alpine-white);
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 1rem;
          font-family: 'Outfit', sans-serif;
          transition: all 0.25s ease;
          appearance: none;
          -webkit-appearance: none;
        }

        input:focus, select:focus {
          outline: none;
          border-color: var(--signal-orange);
          background: rgba(16, 24, 32, 0.9);
          box-shadow: 0 0 0 3px rgba(242, 100, 25, 0.15), 0 4px 12px rgba(0,0,0,0.3);
        }

        input::placeholder { color: var(--text-dim); }

        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23cad2c5' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
          cursor: pointer;
        }

        select option { background: white; color: var(--alpine-white); }

        .error-text {
          color: #e63946;
          font-size: 0.75rem;
          margin-top: 4px;
        }

        .step-nav {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-back, .btn-next, .btn-submit, .btn-recalc, .btn-download {
          padding: 13px 28px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: all 0.25s ease;
          font-family: 'Outfit', sans-serif;
          border: none;
          color: #14333d !important;
        }

        .btn-back {
          background: transparent;
          border: 1px solid var(--glass-border-hover);
          color: var(--text-secondary);
        }

        .btn-back:hover {
          border-color: var(--ice-blue);
          color: var(--ice-blue);
        }

        .btn-next, .btn-submit, .btn-download {
          background: linear-gradient(135deg, var(--signal-orange) 0%, #e55920 100%);
          color: #fff;
          box-shadow: 0 4px 16px var(--orange-glow);
        }

        .btn-next { margin-left: auto; }
        .btn-next:hover, .btn-submit:hover, .btn-download:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--orange-glow);
        }

        .btn-download:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .hidden { display: none !important; }

        .topo-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .topo-bg svg {
          width: 100%;
          height: 100%;
        }

        .topo-overlay {
          position: fixed;
          inset: 0;
          z-index: 1;
          background: radial-gradient(ellipse at 30% 20%, rgba(13, 17, 23, 0.4) 0%, var(--dark-bg) 70%),
                      linear-gradient(180deg, rgba(13, 17, 23, 0.1) 0%, rgba(13, 17, 23, 0.85) 100%);
          pointer-events: none;
        }

        .results-section {
          margin-top: 20px;
        }

        .results-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .results-name {
          font-size: 0.9rem;
          color: var(--signal-orange);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 6px;
        }

        .results-header h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--alpine-white);
        }

        .results-logo {
          width: 64px;
          height: 64px;
          object-fit: contain;
          margin-bottom: 16px;
          filter: drop-shadow(0 2px 12px rgba(242, 100, 25, 0.35));
        }

        .hero-score-card {
          display: flex;
          gap: 40px;
          margin-bottom: 40px;
          align-items: center;
        }

        .hero-score-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .hero-score-right {
          flex: 1;
        }

        .label {
          font-size: 0.8rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
          font-weight: 500;
        }
          input,select,option{
          background: white !important;}

        .radial-wrap { position: relative; width: 200px; height: 200px; }
        .radial-chart { display: block; width: 200px; height: 200px; transform: rotate(-90deg); }
        .radial-track { fill: none; stroke: rgba(255,255,255,0.06); stroke-width: 16; }
        .radial-fill { fill: none; stroke-width: 16; stroke-linecap: round; transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .radial-text-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
        .radial-score-text { color: var(--alpine-white); font-family: 'Outfit', sans-serif; font-size: 42px; font-weight: 800; line-height: 1; }
        .radial-sub-text { color: var(--text-dim); font-family: 'Outfit', sans-serif; font-size: 14px; margin-top: 4px; }
        .score-tier { margin-top: 14px; padding: 5px 16px; border-radius: 99px; font-size: 0.8rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
        .hero-suggestion { font-size: 1rem; color: var(--text-secondary); line-height: 1.7; font-weight: 300; margin-bottom: 28px; }
        .score-breakdown { display: flex; flex-direction: column; gap: 12px; }
        .breakdown-item { display: flex; align-items: center; gap: 12px; }
        .breakdown-label { font-size: 0.78rem; color: var(--text-dim); min-width: 160px; letter-spacing: 0.3px; }
        .mini-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
        .mini-bar { height: 100%; border-radius: 99px; background: var(--ice-blue); width: 0%; transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .mini-bar.orange { background: var(--signal-orange); }
        .breakdown-val { font-size: 0.85rem; font-weight: 600; color: var(--alpine-white); min-width: 28px; text-align: right; }
        .section-title { font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 2px; font-weight: 500; margin-bottom: 16px; padding-top: 8px; display: flex; align-items: center; gap: 10px; }
        .section-title::after { content: ''; flex: 1; height: 1px; background: var(--glass-border); }
        .metric-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 40px; }
        .metric-vcard { padding: 24px; display: flex; flex-direction: column; }
        .mlabel { font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; font-weight: 500; }
        .mlabel.mt { margin-top: 20px; }
        .mbig { font-size: 2.6rem; font-weight: 700; color: var(--alpine-white); line-height: 1.1; }
        .mbig.orange-text { color: var(--signal-orange); }
        .munit { font-size: 0.8rem; color: var(--text-dim); margin-top: 2px; margin-bottom: 4px; }
        .msugg { font-size: 0.85rem; color: var(--text-secondary); margin-top: 10px; font-weight: 300; line-height: 1.5; }
        .bmi-scale { margin: 14px 0 8px; }
        .bmi-bar-track { height: 8px; border-radius: 99px; background: linear-gradient(to right, #e63946 0%, #90be6d 30%, #90be6d 60%, #e63946 100%); position: relative; margin-bottom: 8px; }
        .bmi-marker { position: absolute; top: -4px; width: 16px; height: 16px; background: #fff; border: 3px solid var(--signal-orange); border-radius: 50%; transform: translateX(-50%); transition: left 1s cubic-bezier(0.4, 0, 0.2, 1); left: 50%; box-shadow: 0 0 8px rgba(242,100,25,0.6); }
        .bmi-zone { position: absolute; bottom: -18px; font-size: 0.65rem; color: var(--text-dim); transform: translateX(-50%); }
        .bmi-zone.under { left: 15%; }
        .bmi-zone.ideal { left: 50%; }
        .bmi-zone.over  { left: 85%; }
        .vo2-gauge { margin: 12px 0 8px; position: relative; }
        .gauge-svg { display: block; width: 100%; max-width: 180px; }
        .gauge-labels { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-dim); padding: 0 4px; }
        .fitness-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 40px; }
        .fitness-card.wide { grid-column: span 2; }
        .fitness-card { padding: 22px 26px; }
        .fitness-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .fitness-header h4 { font-size: 0.95rem; font-weight: 600; color: var(--alpine-white); }
        .bar-score-row { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
        .score-pill { font-size: 1.6rem; font-weight: 700; color: var(--signal-orange); min-width: 52px; }
        .score-pill.ice { color: var(--ice-blue); }
        .h-bar-track { flex: 1; height: 10px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
        .h-bar { height: 100%; border-radius: 99px; width: 0%; transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .h-bar.orange { background: linear-gradient(90deg, #c94a0f, var(--signal-orange), #ffa040); }
        .h-bar.ice    { background: linear-gradient(90deg, #5a7e80, #cad2c5, #e0f0f1); }
        .sub-bar-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; margin: 10px 0; }
        .sub-bar-item { display: flex; flex-direction: column; gap: 4px; }
        .sub-bar-label { font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px; }
        .sub-bar-track { height: 5px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
        .sub-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #c94a0f, #ffa040); width: 0%; transition: width 1.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .radar-container { display: flex; justify-content: center; margin: 10px 0;background: #15333c; padding: 16px; border-radius: 12px; }
        #radarChart { max-width: 300px; background: #15333c; }
        .results-actions { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-top: 30px; }
        .btn-recalc { background: transparent; border: 1px solid var(--glass-border-hover); color: var(--text-secondary); padding: 12px 36px; }
        .btn-recalc:hover { border-color: var(--ice-blue); color: var(--ice-blue); }
        @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }
        .shake { animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both; }
        @media (max-width: 768px) { .input-row { flex-direction: column; gap: 14px; } .hero-score-card { flex-direction: column; } .metric-row { grid-template-columns: 1fr; } .fitness-grid { grid-template-columns: 1fr; } .fitness-card.wide { grid-column: span 1; } .logo-text { font-size: 2rem; } }
        #topoBg{display:none;}
      `}</style>
    </>
  );
};