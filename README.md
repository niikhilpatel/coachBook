# HealthTick Calendar App 🗓️

A custom calendar app to schedule onboarding and recurring follow-up calls for coaches. Built with React, TypeScript, Tailwind CSS, and Firebase Firestore.

---

🔗 Deployment (Live App Link)<br>
Deployed on Vercel : 

---
## 🔧 Tech Stack

- React + TypeScript
- Tailwind CSS
- Firebase (Firestore)
- Vite

---

## 🚀 Features

- Daily calendar view from **10:30 AM to 7:30 PM** in 20-minute slots
- Book **Onboarding (40 min)** or **Follow-up (20 min recurring)** calls
- Add/search clients (name + phone)
- Prevents call overlaps and duplicate bookings
- Automatically shows recurring follow-ups
- Firebase Firestore integration (realtime data)
- Loader and button disabled during booking

---

## 📂 Folder Structure

src/ <br>
|__ components/ # Calendar, BookingModal, etc.<br>
|__ firebase/ # Firebase config and queries<br>
|__ pages/ # Main Home page<br>
|__ types/ # TypeScript types<br>
|__ utils/ # Time + overlap logic<br>
|__ data/ # clients.ts<br>



---

## 🧠 Firebase Schema

### Clients Collection
- `name` (string)
- `phone` (string)

### Bookings Collection
- `clientName` (string)
- `clientPhone` (string)
- `callType` (onboarding / follow-up)
- `date` (YYYY-MM-DD)
- `time` (e.g., "10:30 AM")
- `recurring` (boolean)

---

## 📝 How to Run

```bash
git clone https://github.com/niikhilpatel/healthtick-calender.git
```
```bash
cd healthtick-calendar
```
```bash
npm install
```
```bash
npm run dev
```
---

### 🔐 Environment Variables

Create a `.env` file in the root with the following:

```env
VITE_API_KEY=your_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_id
VITE_APP_ID=your_app_id
```

for using mine Firebase config paste below code
```env
VITE_API_KEY=AIzaSyBRGbGmQHZpCwIDp3aWQynyohN9UFnYlF0
VITE_AUTH_DOMAIN=healthtick-1a710.firebaseapp.com
VITE_PROJECT_ID=healthtick-1a710
VITE_STORAGE_BUCKET=healthtick-1a710.firebasestorage.app
VITE_MESSAGING_SENDER_ID=152827652655
VITE_APP_ID=1:152827652655:web:032e9d1fe96b60cbb8b4da
```
---

### 🧠 Assumptions Made

- **Follow-up calls** are stored once and repeated weekly based on the same weekday and time.
- **Time slots** are fixed: 20-minute intervals from **10:30 AM to 7:30 PM**.
- **Client list** is stored and fetched from Firebase Firestore (not hardcoded).
- **Time displayed** is local to the browser (no timezone conversion).
- **Authentication** is not required; the app is assumed to be used by a single coach/admin.
- **Bookings** store only the start time; end time is inferred based on call type duration.
- **Call overlap checks** are performed using both that day’s one-time and recurring bookings.

---

🙋‍♂️ Author
Made by Your <br>
Name : Nikhil Patel<br>
Mail Id : nikhildevcode@gmail.com<br>