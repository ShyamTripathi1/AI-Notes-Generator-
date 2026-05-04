# ExamNotes AI 🚀

**ExamNotes AI** is a state-of-the-art academic assistant designed to transform simple topics into comprehensive, industrial-grade study material. Powered by **Llama 3.3 (via Groq)** and **Mermaid.js**, it generates structured notes that are visually rich, exam-oriented, and ready for high-resolution PDF export.

![Application Layout](public/assets/overview.png) *(Note: Assets are generated dynamically or stored in public/assets)*

---

## ✨ Key Features

### 📖 Adaptive Study Guides
- Deep-dive explanations into granular subtopics.
- "Exam Insights" for each topic highlighting common patterns and tested concepts.
- Practical real-world examples and interactive MCQ practice sets.

### 📊 Visual Learning Aids
- Dynamic **Mermaid.js** integration to generate flowcharts, sequence diagrams, and mind maps.
- Logic and C++ code implementation studio for technical subjects.

### 📝 Perfect PDF Export
- **Standardized A4 Format**: Optimized width and centering for a professional desktop document look.
- **Multi-Page Stability**: Advanced page-breaking logic prevents blank pages and content clipping.
- **High Resolution (Scale 3X)**: Ensures text and diagrams remain sharp when zoomed or printed.

### ⚡ Performance & Polish
- **Blazing Fast**: Powered by Groq for near-instant generation.
- **Rich Aesthetics**: A modern, glassmorphic UI with floating navigation for easy reading.
- **C++ Optimized**: Specialized support for technical algorithms in C++.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **AI Engine**: [Groq SDK](https://wow.groq.com/) (Llama-3.3-70b)
- **Styling**: Vanilla CSS (Custom Glassmorphic System)
- **Diagrams**: [Mermaid.js](https://mermaid.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **PDF Core**: [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- A Groq API Key (Get one at [console.groq.com](https://console.groq.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/2313058/ai-notes-generator.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_actual_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the application!

---

## 📸 Screenshots & Usage

1. **Generate**: Enter your topic and field of study.
2. **Review**: High-quality notes appear with diagrams and MCQs.
3. **Export**: Click the **PDF** button to save a professional document locally.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve Note generation quality or UI aesthetics.

---

### Created by [Shyam Tripathi](https://github.com/ShyamTripathi1)
