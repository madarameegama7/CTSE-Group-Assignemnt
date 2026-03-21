export const DOCTORS = [
  { id:'d1', name:'Dr. James Harlow',  specialty:'Cardiologist',  department:'Cardiology',    experience:'12 yrs', rating:4.9, reviews:284, fee:150, avatar:'JH', available:true,  nextSlot:'Today 2:00 PM' },
  { id:'d2', name:'Dr. Priya Nair',    specialty:'Neurologist',   department:'Neurology',     experience:'8 yrs',  rating:4.8, reviews:196, fee:175, avatar:'PN', available:true,  nextSlot:'Tomorrow 10:00 AM' },
  { id:'d3', name:'Dr. Marcus Webb',   specialty:'Orthopedic',    department:'Orthopedics',   experience:'15 yrs', rating:4.7, reviews:312, fee:130, avatar:'MW', available:false, nextSlot:'Thu 3:00 PM' },
  { id:'d4', name:'Dr. Elena Vasquez', specialty:'Dermatologist', department:'Dermatology',   experience:'6 yrs',  rating:4.9, reviews:158, fee:120, avatar:'EV', available:true,  nextSlot:'Today 4:30 PM' },
  { id:'d5', name:'Dr. Omar Khalil',   specialty:'Pediatrician',  department:'Pediatrics',    experience:'10 yrs', rating:4.8, reviews:421, fee:100, avatar:'OK', available:true,  nextSlot:'Tomorrow 9:00 AM' },
  { id:'d6', name:'Dr. Sophie Laurent',specialty:'Psychiatrist',  department:'Psychiatry',    experience:'9 yrs',  rating:4.9, reviews:237, fee:200, avatar:'SL', available:false, nextSlot:'Fri 11:00 AM' },
];

export const APPOINTMENTS = [
  { id:'a1', patientId:'p1', patientName:'Sarah Mitchell',   doctorId:'d1', doctorName:'Dr. James Harlow',  specialty:'Cardiologist',  date:'2026-03-22', time:'10:00 AM', status:'CONFIRMED',  type:'Check-up',     fee:150, notes:'Annual cardiac screening' },
  { id:'a2', patientId:'p1', patientName:'Sarah Mitchell',   doctorId:'d4', doctorName:'Dr. Elena Vasquez', specialty:'Dermatologist', date:'2026-03-26', time:'2:30 PM',  status:'PENDING',    type:'Consultation', fee:120, notes:'Skin rash evaluation' },
  { id:'a3', patientId:'p1', patientName:'Sarah Mitchell',   doctorId:'d2', doctorName:'Dr. Priya Nair',    specialty:'Neurologist',   date:'2026-03-11', time:'11:00 AM', status:'COMPLETED',  type:'Follow-up',    fee:175, notes:'Migraine follow-up' },
  { id:'a4', patientId:'p2', patientName:'Robert Thompson',  doctorId:'d1', doctorName:'Dr. James Harlow',  specialty:'Cardiologist',  date:'2026-03-21', time:'9:00 AM',  status:'CONFIRMED',  type:'Emergency',    fee:150, notes:'' },
  { id:'a5', patientId:'p3', patientName:'Linda Park',       doctorId:'d1', doctorName:'Dr. James Harlow',  specialty:'Cardiologist',  date:'2026-03-21', time:'11:30 AM', status:'CONFIRMED',  type:'Check-up',     fee:150, notes:'' },
  { id:'a6', patientId:'p4', patientName:'David Kim',        doctorId:'d1', doctorName:'Dr. James Harlow',  specialty:'Cardiologist',  date:'2026-03-23', time:'3:00 PM',  status:'PENDING',    type:'Consultation', fee:150, notes:'Chest pain evaluation' },
  { id:'a7', patientId:'p5', patientName:'Amy Johnson',      doctorId:'d1', doctorName:'Dr. James Harlow',  specialty:'Cardiologist',  date:'2026-03-18', time:'10:00 AM', status:'CANCELLED',  type:'Follow-up',    fee:150, notes:'' },
  { id:'a8', patientId:'p6', patientName:'Michael Brown',    doctorId:'d1', doctorName:'Dr. James Harlow',  specialty:'Cardiologist',  date:'2026-03-20', time:'2:00 PM',  status:'COMPLETED',  type:'Check-up',     fee:150, notes:'Routine ECG done' },
];

export const SLOTS = [
  { id:'s1',  time:'9:00 AM',  available:false },
  { id:'s2',  time:'9:30 AM',  available:true  },
  { id:'s3',  time:'10:00 AM', available:false },
  { id:'s4',  time:'10:30 AM', available:true  },
  { id:'s5',  time:'11:00 AM', available:true  },
  { id:'s6',  time:'11:30 AM', available:false },
  { id:'s7',  time:'2:00 PM',  available:true  },
  { id:'s8',  time:'2:30 PM',  available:true  },
  { id:'s9',  time:'3:00 PM',  available:false },
  { id:'s10', time:'3:30 PM',  available:true  },
  { id:'s11', time:'4:00 PM',  available:true  },
  { id:'s12', time:'4:30 PM',  available:false },
];

export const MONTHLY_DATA = [
  { month:'Jan', appointments:312, revenue:46800 },
  { month:'Feb', appointments:285, revenue:42750 },
  { month:'Mar', appointments:398, revenue:59700 },
  { month:'Apr', appointments:356, revenue:53400 },
  { month:'May', appointments:421, revenue:63150 },
  { month:'Jun', appointments:389, revenue:58350 },
  { month:'Jul', appointments:445, revenue:66750 },
  { month:'Aug', appointments:412, revenue:61800 },
];

export const USERS_LIST = [
  { id:'p1', name:'Sarah Mitchell',  email:'patient@demo.com', role:'PATIENT', status:'ACTIVE',  joined:'2025-06-12' },
  { id:'p2', name:'Robert Thompson', email:'r.thompson@email.com', role:'PATIENT', status:'ACTIVE',  joined:'2025-08-03' },
  { id:'p3', name:'Linda Park',      email:'linda.p@email.com',    role:'PATIENT', status:'ACTIVE',  joined:'2025-09-17' },
  { id:'p4', name:'David Kim',       email:'david.k@email.com',    role:'PATIENT', status:'INACTIVE',joined:'2025-11-01' },
  { id:'d1', name:'Dr. James Harlow',email:'doctor@demo.com',      role:'DOCTOR',  status:'ACTIVE',  joined:'2024-01-15' },
  { id:'d2', name:'Dr. Priya Nair',  email:'p.nair@medibook.com',  role:'DOCTOR',  status:'ACTIVE',  joined:'2024-03-20' },
  { id:'a1', name:'Alex Chen',       email:'admin@demo.com',       role:'ADMIN',   status:'ACTIVE',  joined:'2023-11-05' },
];