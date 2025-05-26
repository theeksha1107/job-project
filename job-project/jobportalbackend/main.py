from datetime import date
import os
import random
import smtplib
import time
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from database import get_db_connection
from auth import hash_password, verify_password
from models import EmployeeLogin, EmployeeRegister, ProfileData

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Console output
        logging.FileHandler('app.log')  # Log to file
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("app_with_enhanced_logging.py:45 - CORS middleware configured")

# OTP Storage
otp_storage = {}
logger.debug("app_with_enhanced_logging.py:49 - OTP storage initialized")

# Uploads folder
UPLOADS = "uploads"
os.makedirs(UPLOADS, exist_ok=True)
logger.info(f"app_with_enhanced_logging.py:54 - Uploads directory ensured: {UPLOADS}")

# SMTP Configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SMTP_USER = "quantamqlabs1@gmail.com"
SMTP_PASSWORD = "hqnd lepo ifde bmel"  # App Password
logger.debug("app_with_enhanced_logging.py:61 - SMTP configuration loaded")

# Helper: Send Email
def send_email(to_email, subject, message):
    logger.debug(f"app_with_enhanced_logging.py:65 - Sending email to {to_email} with subject: {subject}")
    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(message, "plain"))
        logger.debug("app_with_enhanced_logging.py:71 - Email message prepared")

        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            logger.debug("app_with_enhanced_logging.py:75 - SMTP server login successful")
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        logger.info(f"app_with_enhanced_logging.py:77 - Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"app_with_enhanced_logging.py:80 - Failed to send email to {to_email}: {str(e)}")
        return False

# Helper: OTP Expiry
def is_otp_expired(email):
    logger.debug(f"app_with_enhanced_logging.py:85 - Checking OTP expiry for {email}")
    if email in otp_storage:
        timestamp = otp_storage[email]["timestamp"]
        if time.time() - timestamp > 300:
            logger.warning(f"app_with_enhanced_logging.py:89 - OTP expired for {email}")
            del otp_storage[email]
            return True
    logger.debug(f"app_with_enhanced_logging.py:92 - No valid OTP found for {email}")
    return False

# --- MODELS ---

class JobPost(BaseModel):
    id: Optional[int] = None
    title: str
    company: str
    location: str
    experience: str
    salary: str
    jobType: str
    workMode: str
    skills: List[str]
    description: str
    postedDate: Optional[date] = None
    deadline: date
    applicants: int = 0

class ResumeRegister(BaseModel):
    candidateName: Optional[str] = None
    location: Optional[str] = None
    minSalary: Optional[str] = None
    maxSalary: Optional[str] = None
    noticePeriod: Optional[str] = None
    degree: Optional[str] = None
    university: Optional[str] = None
    fromYear: Optional[str] = None
    toYear: Optional[str] = None
    specialization: Optional[str] = None
    minExperience: Optional[str] = None
    maxExperience: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    industry: Optional[str] = None
    technicalSkills: Optional[str] = None
    softSkills: Optional[str] = None
    languages: Optional[str] = None
    certifications: Optional[str] = None
    gender: Optional[str] = None
    disability: Optional[str] = None
    category: Optional[str] = None
    resumeFreshness: Optional[str] = None

class OTPRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class JobFilter(BaseModel):
    skillset: Optional[str] = None
    city: Optional[str] = None
    min_experience: Optional[int] = None
    work_mode: Optional[str] = None

class Candidate(BaseModel):
    id: int
    name: str
    role: str
    company: str
    experience: str
    location: str
    ctc: str
    noticePeriod: str
    degree: str
    university: str
    passingYear: str
    skills: List[str]
    gender: str
    category: str
    resumeUpdated: str

# --- ROUTES ---

@app.post("/register")
async def register(employee: EmployeeRegister):
    logger.info(f"app_with_enhanced_logging.py:159 - Register attempt for email: {employee.email}")
    logger.debug(f"app_with_enhanced_logging.py:160 - Register data: {employee.dict()}")
    
    if employee.password != employee.confirm_password:
        logger.warning("app_with_enhanced_logging.py:163 - Password and confirm password do not match")
        raise HTTPException(status_code=400, detail="Passwords do not match")

    conn = get_db_connection()
    if not conn:
        logger.error("app_with_enhanced_logging.py:168 - Database connection failed")
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    logger.debug(f"app_with_enenhanced_logging.py:171 - Checking if email {employee.email} exists")
    cursor.execute("SELECT * FROM employees WHERE email = %s", (employee.email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        logger.warning(f"app_with_enhanced_logging.py:176 - Email {employee.email} already registered")
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = hash_password(employee.password)
    logger.debug(f"app_with_enhanced_logging.py:180 - Inserting new user with email: {employee.email}")
    cursor.execute(
        "INSERT INTO employees (full_name, email, password) VALUES (%s, %s, %s)",
        (employee.full_name, employee.email, hashed_password)
    )
    conn.commit()
    logger.info(f"app_with_enhanced_logging.py:185 - User {employee.email} registered successfully")
    cursor.close()
    conn.close()
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(employee: EmployeeLogin):
    logger.info(f"app_with_enhanced_logging.py:191 - Login attempt for email: {employee.email}")
    logger.debug(f"app_with_enhanced_logging.py:192 - Login data: {employee.dict()}")
    
    conn = get_db_connection()
    if not conn:
        logger.error("app_with_enhanced_logging.py:196 - Database connection failed")
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor(dictionary=True)
    logger.debug(f"app_with_enhanced_logging.py:199 - Fetching user with email: {employee.email}")
    cursor.execute("SELECT * FROM employees WHERE email = %s", (employee.email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not verify_password(employee.password, user["password"]):
        logger.warning(f"app_with_enhanced_logging.py:205 - Invalid login attempt for {employee.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")

    logger.info(f"app_with_enhanced_logging.py:208 - User {employee.email} logged in successfully")
    return {"message": "Login successful", "email": employee.email}

@app.post("/send-otp")
async def send_otp(request: OTPRequest):
    logger.info(f"app_with_enhanced_logging.py:213 - OTP request for email: {request.email}")
    
    conn = get_db_connection()
    if not conn:
        logger.error("app_with_enhanced_logging.py:217 - Database connection failed")
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor(dictionary=True)
    logger.debug(f"app_with_enhanced_logging.py:220 - Checking if email {request.email} is registered")
    cursor.execute("SELECT * FROM employees WHERE email = %s", (request.email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        logger.warning(f"app_with_enhanced_logging.py:226 - Email {request.email} not registered")
        raise HTTPException(status_code=404, detail="Email not registered")

    otp = str(random.randint(100000, 999999))
    otp_storage[request.email] = {"otp": otp, "timestamp": time.time()}
    logger.debug(f"app_with_enhanced_logging.py:231 - Generated OTP {otp} for {request.email}")

    subject = "Your OTP for Login"
    message = f"Your OTP code is: {otp}.\n\nIt is valid for 5 minutes."

    if send_email(request.email, subject, message):
        logger.info(f"app_with_enhanced_logging.py:237 - OTP sent successfully to {request.email}")
        return {"message": "OTP sent successfully"}
    else:
        logger.error(f"app_with_enhanced_logging.py:240 - Failed to send OTP to {request.email}")
        raise HTTPException(status_code=500, detail="Failed to send OTP")

@app.post("/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    logger.info(f"app_with_enhanced_logging.py:245 - OTP verification attempt for email: {request.email}")
    logger.debug(f"app_with_enhanced_logging.py:246 - OTP provided: {request.otp}")
    
    if is_otp_expired(request.email):
        logger.warning(f"app_with_enhanced_logging.py:249 - OTP expired for {request.email}")
        raise HTTPException(status_code=400, detail="OTP expired")

    if request.email not in otp_storage or otp_storage[request.email]["otp"] != request.otp:
        logger.warning(f"app_with_enhanced_logging.py:253 - Invalid OTP for {request.email}")
        raise HTTPException(status_code=400, detail="Invalid OTP")

    del otp_storage[request.email]
    logger.info(f"app_with_enhanced_logging.py:257 - OTP verified successfully for {request.email}")
    return {"message": "Login successful"}

@app.post("/forgot-password")
async def forgot_password(request: OTPRequest):
    logger.info(f"app_with_enhanced_logging.py:262 - Password reset OTP request for email: {request.email}")
    
    conn = get_db_connection()
    if not conn:
        logger.error("app_with_enhanced_logging.py:266 - Database connection failed")
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor(dictionary=True)
    logger.debug(f"app_with_enhanced_logging.py:269 - Checking if email {request.email} exists")
    cursor.execute("SELECT * FROM employees WHERE email = %s", (request.email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        logger.warning(f"app_with_enhanced_logging.py:275oldid:276 - Email {request.email} not found")
        raise HTTPException(status_code=400, detail="Email not found")

    otp = str(random.randint(100000, 999999))
    otp_storage[request.email] = {"otp": otp, "timestamp": time.time()}
    logger.debug(f"app_with_enhanced_logging.py:280 - Generated password reset OTP {otp} for {request.email}")

    subject = "Password Reset OTP"
    message = f"Your OTP is: {otp}.\n\nIt is valid for 5 minutes."

    if send_email(request.email, subject, message):
        logger.info(f"app_with_enhanced_logging.py:286 - Password reset OTP sent to {request.email}")
        return {"message": "OTP sent successfully"}
    else:
        logger.error(f"app_with_enhanced_logging.py:289 - Failed to send password reset OTP to {request.email}")
        raise HTTPException(status_code=500, detail="Failed to send OTP")

@app.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    logger.info(f"app_with_enhanced_logging.py:294 - Password reset attempt for email: {request.email}")
    logger.debug(f"app_with_enhanced_logging.py:295 - OTP provided: {request.otp}")
    
    if is_otp_expired(request.email):
        logger.warning(f"app_with_enhanced_logging.py:298 - OTP expired for {request.email}")
        raise HTTPException(status_code=400, detail="OTP expired")

    if request.email not in otp_storage or otp_storage[request.email]["otp"] != request.otp:
        logger.warning(f"app_with_enhanced_logging.py:302 - Invalid OTP for password reset: {request.email}")
        raise HTTPException(status_code=400, detail="Invalid OTP")

    hashed_password = hash_password(request.new_password)
    conn = get_db_connection()  # Corrected from azimuth_db_connection()
    if not conn:
        logger.error("app_with_enhanced_logging.py:308 - Database connection failed")
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    logger.debug(f"app_with_enhanced_logging.py:311 - Updating password for {request.email}")
    cursor.execute("UPDATE employees SET password = %s WHERE email = %s", (hashed_password, request.email))
    conn.commit()
    logger.info(f"app_with_enhanced_logging.py:314 - Password updated for {request.email}")
    cursor.close()
    conn.close()

    del otp_storage[request.email]
    logger.info(f"app_with_enhanced_logging.py:319 - Password reset successful for {request.email}")
    return {"message": "Password reset successful"}

@app.post("/search")
async def search_jobs(filter: JobFilter):
    logger.info("app_with_enhanced_logging.py:324 - Job search request received")
    logger.debug(f"app_with_enhanced_logging.py:325 - Search filters: {filter.dict()}")
    
    if not any([filter.skillset, filter.city, filter.min_experience, filter.work_mode]):
        logger.warning("app_with_enhanced_logging.py:328 - No filters provided for job search")
        raise HTTPException(status_code=400, detail="At least one filter must be provided")

    conn = get_db_connection()
    if not conn:
        logger.error("app_with_enhanced_logging.py:333 - Database connection failed")
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM jobs WHERE 1=1"
    params = []

    if filter.skillset:
        query += " AND skillset LIKE %s"
        params.append(f"%{filter.skillset}%")
    if filter.city:
        query += " AND city = %s"
        params.append(filter.city)
    if filter.min_experience is not None:
        query += " AND experience >= %s"
        params.append(filter.min_experience)
    if filter.work_mode:
        query += " AND work_mode = %s"
        params.append(filter.work_mode)

    logger.debug(f"app_with_enhanced_logging.py:350 - Executing job search query: {query} with params: {params}")
    cursor.execute(query, params)
    jobs = cursor.fetchall()
    cursor.close()
    conn.close()

    if not jobs:
        logger.info("app_with_enhanced_logging.py:356 - No jobs found for the provided filters")
        raise HTTPException(status_code=404, detail="No jobs found")

    logger.info(f"app_with_enhanced_logging.py:359 - Found {len(jobs)} jobs matching filters")
    return {"jobs": jobs}

@app.post("/apply")
async def apply_for_job(
    name: str = Form(...),
    email: str = Form(...),
    job_title: str = Form(...),
    company: str = Form(...),
    resume: UploadFile = File(...)
):
    logger.info(f"app_with_enhanced_logging.py:369 - Job application attempt by {email} for {job_title} at {company}")
    logger.debug(f"app_with_enhanced_logging.py:370 - Application data: name={name}, email={email}, job_title={job_title}, company={company}, resume={resume.filename}")
    
    try:
        file_location = f"{UPLOADS}/{resume.filename}"
        with open(file_location, "wb") as buffer:
            buffer.write(await resume.read())
        logger.info(f"app_with_enhanced_logging.py:376 - Resume saved at {file_location} for {email}")
        return {"message": "Application submitted", "file_saved": file_location}
    except Exception as e:
        logger.error(f"app_with_enhanced_logging.py:379 - Error saving resume for {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

# Sample Job Listings
job_listings: List[JobPost] = []
logger.info("app_with_enhanced_logging.py:385 - Initialized empty job listings")

@app.get("/jobs", response_model=List[JobPost])
async def get_jobs():
    logger.info("app_with_enhanced_logging.py:389 - Fetching all job listings")
    logger.debug(f"app_with_enhanced_logging.py:390 - Current job listings count: {len(job_listings)}")
    return job_listings

@app.post("/post-job", response_model=JobPost)
async def post_job(job: JobPost):
    logger.info("app_with_enhanced_logging.py:395 - Posting new job")
    logger.debug(f"app_with_enhanced_logging.py:396 - Job data: {job.dict()}")
    
    job.id = len(job_listings) + 1
    job.postedDate = date.today()
    job_listings.insert(0, job)
    logger.info(f"app_with_enhanced_logging.py:401 - Job posted successfully with ID: {job.id}")
    return job

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    logger.info(f"app_with_enhanced_logging.py:406 - Uploading resume: {file.filename}")
    
    try:
        file_location = f"{UPLOADS}/{file.filename}"
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())
        logger.info(f"app_with_enhanced_logging.py:412 - Resume uploaded successfully to {file_location}")
        return {"fileName": file.filename, "message": "Resume uploaded successfully"}
    except Exception as e:
        logger.error(f"app_with_enhanced_logging.py:415 - Error uploading resume {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error uploading resume: {str(e)}")

@app.post("/save-profile")
async def save_profile(profile: ProfileData):
    logger.info(f"app_with_enhanced_logging.py:420 - Saving profile for email: {profile.email}")
    logger.debug(f"app_with_enhanced_logging.py:421 - Profile data: {profile.dict()}")
    
    try:
        # Validate required fields
        required_fields = ["firstName", "lastName", "email", "mobileNumber", "gender", "currentLocation"]
        missing_fields = [field for field in required_fields if not getattr(profile, field)]
        if missing_fields:
            logger.warning(f"app_with_enhanced_logging.py:427 - Missing required fields: {', '.join(missing_fields)}")
            raise HTTPException(status_code=400, detail=f"Missing required fields: {', '.join(missing_fields)}")

        conn = get_db_connection()
        if not conn:
            logger.error("app_with_enhanced_logging.py:432 - Database connection failed")
            raise HTTPException(status_code=500, detail="Database connection failed")
        cursor = conn.cursor()

        # Convert primarySkills list to comma-separated string for DB storage
        primary_skills_str = ",".join(profile.primarySkills) if profile.primarySkills else ""
        logger.debug(f"app_with_enhanced_logging.py:438 - Converted primary skills to string: {primary_skills_str}")

        # Insert or update profile
        query = """
            INSERT INTO employee_profiles (
                avatar, first_name, last_name, email, mobile_number, gender,
                current_location, highest_qualification, university, primary_skills,
                project_details, notice_period, preferred_salary, address,
                physically_challenged, preferred_location, current_ctc, visa, resume_file_name
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                avatar=VALUES(avatar),
                first_name=VALUES(first_name),
                last_name=VALUES(last_name),
                mobile_number=VALUES(mobile_number),
                gender=VALUES(gender),
                current_location=VALUES(current_location),
                highest_qualification=VALUES(highest_qualification),
                university=VALUES(university),
                primary_skills=VALUES(primary_skills),
                project_details=VALUES(project_details),
                notice_period=VALUES(notice_period),
                preferred_salary=VALUES(preferred_salary),
                address=VALUES(address),
                physically_challenged=VALUES(physically_challenged),
                preferred_location=VALUES(preferred_location),
                current_ctc=VALUES(current_ctc),
                visa=VALUES(visa),
                resume_file_name=VALUES(resume_file_name)
        """
        values = (
            profile.avatar,
            profile.firstName,
            profile.lastName,
            profile.email,
            profile.mobileNumber,
            profile.gender,
            profile.currentLocation,
            profile.highestQualification,
            profile.university,
            primary_skills_str,
            profile.projectDetails,
            profile.noticePeriod,
            profile.preferredSalary,
            profile.address,
            profile.physicallyChallenged,
            profile.preferredLocation,
            profile.currentCTC,
            profile.visa,
            profile.resumeFileName
        )

        logger.debug(f"app_with_enhanced_logging.py:476 - Executing profile save query for {profile.email}")
        cursor.execute(query, values)
        conn.commit()
        logger.info(f"app_with_enhanced_logging.py:479 - Profile saved successfully for {profile.email}")
        cursor.close()
        conn.close()
        return {"message": "Profile saved successfully"}
    except Exception as e:
        logger.error(f"app_with_enhanced_logging.py:483 - Error saving profile for {profile.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving profile: {str(e)}")

@app.get("/get-profile/{email}")
async def get_profile(email: str):
    logger.info(f"app_with_enhanced_logging.py:488 - Fetching profile for email: {email}")
    
    try:
        conn = get_db_connection()
        if not conn:
            logger.error("app_with_enhanced_logging.py:493 - Database connection failed")
            raise HTTPException(status_code=500, detail="Database connection failed")
        cursor = conn.cursor(dictionary=True)
        logger.debug(f"app_with_enhanced_logging.py:496 - Querying profile for {email}")
        cursor.execute("SELECT * FROM employee_profiles WHERE email = %s", (email,))
        profile = cursor.fetchone()
        cursor.close()
        conn.close()

        if not profile:
            logger.warning(f"app_with_enhanced_logging.py:502 - Profile not found for {email}")
            raise HTTPException(status_code=404, detail="Profile not found")

        # Convert comma-separated primarySkills back to list
        profile["primarySkills"] = profile["primary_skills"].split(",") if profile["primary_skills"] else []
        del profile["primary_skills"]  # Remove DB field name
        logger.info(f"app_with_enhanced_logging.py:508 - Profile retrieved successfully for {email}")
        return profile
    except Exception as e:
        logger.error(f"app_with_enhanced_logging.py:511 - Error retrieving profile for {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving profile: {str(e)}")

@app.get("/profiles", response_model=List[Candidate])
async def get_profiles():
    logger.info("app_with_enhanced_logging.py:516 - Fetching all candidate profiles")
    
    try:
        conn = get_db_connection()
        if not conn:
            logger.error("app_with_enhanced_logging.py:521 - Database connection failed")
            raise HTTPException(status_code=500, detail="Database connection failed")
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT 
                id, 
                CONCAT(first_name, ' ', last_name) as name,
                'Unknown' as role,  -- Adjust if role is stored elsewhere
                'Unknown' as company,  -- Adjust if company is stored elsewhere
                '0 years' as experience,  -- Adjust if experience is stored elsewhere
                current_location as location,
                current_ctc as ctc,
                notice_period as noticePeriod,
                highest_qualification as degree,
                university,
                'Unknown' as passingYear,  -- Adjust if passing year is stored elsewhere
                primary_skills as skills,
                gender,
                'General' as category,  -- Adjust if category is stored elsewhere
                NOW() as resumeUpdated  -- Adjust if resume updated timestamp is stored
            FROM employee_profiles
        """
        logger.debug("app_with_enhanced_logging.py:542 - Executing query to fetch all profiles")
        cursor.execute(query)
        profiles = cursor.fetchall()

        # Convert skills string to list and format resumeUpdated
        for profile in profiles:
            profile['skills'] = profile['skills'].split(',') if profile['skills'] else []
            profile['resumeUpdated'] = profile['resumeUpdated'].isoformat()

        cursor.close()
        conn.close()
        logger.info(f"app_with_enhanced_logging.py:551 - Retrieved {len(profiles)} candidate profiles")
        return profiles
    except Exception as e:
        logger.error(f"app_with_enhanced_logging.py:554 - Error fetching profiles: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching profiles: {str(e)}")