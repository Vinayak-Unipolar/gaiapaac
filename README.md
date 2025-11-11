# Gaiapac Backend API

Backend server for handling contact form submissions.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend/` folder:
```bash
# Copy from env.example.txt or create manually
cp env.example.txt .env
```

3. Configure your environment variables in `.env`:
   - **PORT**: Server port (default: 5000)
   - **FRONTEND_URL**: Frontend URL for CORS (default: http://localhost:5173)

See `ENV_SETUP.md` in the root directory for detailed environment variable documentation.

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### POST `/api/contact`
Submit a contact form.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "companyName": "Example Corp",
  "phoneNumber": "+971 XX XXX XXXX",
  "serviceInterest": "packaging-design",
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon."
}
```

### GET `/api/health`
Health check endpoint.

## Notes

- Contact form submissions are logged to the console
- Make sure CORS is properly configured for your frontend URL
- You can add email functionality later by integrating a service like SendGrid, AWS SES, or nodemailer

