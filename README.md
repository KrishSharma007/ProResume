# ProResume: AI-Powered Resume Analysis

ProResume is an innovative application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS) and industry standards. Leveraging AI capabilities, it analyzes resumes, provides compatibility scores, identifies key skills, and offers personalized feedback to enhance job application success.




## Features

*   **ATS Compatibility Scoring**: Analyzes resume content against common ATS keywords and provides a compatibility score.
*   **Industry Benchmarking**: Compares your resume against industry standards and benchmarks.
*   **Skill Analysis**: Identifies strong and missing skills based on job descriptions and industry trends.
*   **Personalized Feedback**: Offers tailored recommendations for improving your resume.
*   **Web Scraping**: Gathers real-time job data and industry insights for accurate analysis.
*   **AI-Powered Analysis**: Utilizes advanced AI models (e.g., Cohere) for in-depth resume evaluation.



## Technology Stack

**Frontend:**
*   React
*   Vite
*   Tailwind CSS

**Backend:**
*   Node.js
*   Express.js
*   `pdf-parse` for PDF processing
*   `multer` for handling file uploads
*   `cors` for Cross-Origin Resource Sharing
*   `dotenv` for environment variable management
*   Cohere API for AI-powered analysis
*   Custom modules for ATS keyword analysis, industry benchmarks, and web scraping.



## Project Structure

The repository is organized into two main directories: `backend` and `frontend`.

```
ProResume-AI/
├── backend/
│   ├── .gitignore
│   ├── ats_keywords.js
│   ├── industry_benchmarks.js
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── vercel.json
│   └── web-scrape.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── blocks/
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── jsrepo.json
    ├── package-lock.json
    ├── package.json
    └── vite.config.js
```




## Setup and Installation

To set up and run ProResume locally, follow these steps:

### Prerequisites

*   Node.js (v14 or higher)
*   npm (Node Package Manager)

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd ProResume-AI/backend
    ```
2.  Install the backend dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add your Cohere API key:
    ```
    COHERE_API_KEY=your_cohere_api_key_here
    ```
4.  Start the backend server:
    ```bash
    node server.js
    ```
    The backend server will run on `http://localhost:8080` (or the port specified in your `.env` file).

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```
2.  Install the frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend application will typically open in your browser at `http://localhost:5173` (or another available port).




## Usage

1.  **Upload Your Resume**: On the frontend interface, upload your resume in PDF format.
2.  **AI Analysis**: The backend will process your resume using AI, analyzing it for ATS compatibility, industry benchmarks, and skills.
3.  **Receive Feedback**: The frontend will display a detailed breakdown of your resume's strengths and weaknesses, along with personalized recommendations for improvement.




## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.



