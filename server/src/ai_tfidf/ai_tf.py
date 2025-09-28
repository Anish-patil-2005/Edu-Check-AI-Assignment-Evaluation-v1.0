
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import numpy as np
import re  # <-- Add this line


app = Flask(__name__)

bert_model = SentenceTransformer("all-MiniLM-L6-v2")



# --- OUR NEW PRE-PROCESSING PIPELINE ---
def preprocess_text(text):
    # Step 1: Remove cover page patterns
    text = remove_cover_page_info(text)
    # Step 2: Remove structural words
    text = remove_structural_words(text)
    return text

def remove_cover_page_info(text):
    pattern = r'(?im)^\s*(Name|Std|Branch|Roll No|PRN|Subject|Assignment|Vishwakarma|References|Bibliography|Citations)[\s:]*.*$'
    cleaned_text = re.sub(pattern, '', text)
    return cleaned_text.strip()

def remove_structural_words(text):
    custom_stop_words = {
        'aim', 'theory', 'procedure', 'observation', 'conclusion',
        'result', 'introduction', 'algorithm', 'program', 'code'
    }
    words = text.split()
    filtered_words = [word for word in words if word.lower() not in custom_stop_words]
    return ' '.join(filtered_words)

#now check

@app.route("/check-assignment", methods=["POST"])
def check_assignment():
    try:
        data = request.json
        student_assignment = preprocess_text(data["studentText"])
        
        #empty submission -> tfidf should not crash that's why.
        if not student_assignment:
            return jsonify({
                "status": "rejected", 
                "reason": f"Submission is empty after removing boilerplate text."
            }), 200
        
        #  size words limit 
        if len(data.get("studentText", "")) > 1000000:
            return jsonify({"error": "Submission exceeds maximum length."}), 413
        
        teacher_sample = preprocess_text(data["teacherText"])
        old_assignments = [preprocess_text(doc) for doc in data.get("allAssignments", [])]
        
        threshold = float(data.get("threshold", 75))

        # --- Step 1: student vs old submissions (TF-IDF) ---
        if old_assignments:
            vectorizer = TfidfVectorizer()
            vectors = vectorizer.fit_transform([student_assignment] + old_assignments)
            similarity_matrix = cosine_similarity(vectors[0:1], vectors[1:])
            max_student_similarity = float(np.max(similarity_matrix))
        else:
            max_student_similarity = 0.0

        # --- Step 2: student vs teacher (BERT) ---
        student_embedding = bert_model.encode([student_assignment], convert_to_tensor=True)
        teacher_embedding = bert_model.encode([teacher_sample], convert_to_tensor=True)

        teacher_similarity = float(
            cosine_similarity(
                student_embedding.cpu().numpy().reshape(1, -1),
                teacher_embedding.cpu().numpy().reshape(1, -1)
            )[0][0]
        )

        # --- Convert to percentages ---
        sim_with_students = max_student_similarity * 100
        sim_with_teacher = teacher_similarity * 100

        # --- Step 3: rejection logic based on student similarity ---
        if sim_with_students >= threshold:
            return jsonify({
                "status": "rejected",
                "reason": f"Similarity {sim_with_students:.2f}% exceeds threshold {threshold}%",
                "similarityWithStudents": round(sim_with_students, 2),
                "similarityWithTeacher": sim_with_teacher
            })

        return jsonify({
            "status": "accepted",
            "similarityWithStudents": round(sim_with_students, 2),
            "similarityWithTeacher": sim_with_teacher
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)