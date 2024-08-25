from flask import Flask, render_template, request, redirect, url_for
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['UPLOAD_FOLDER'] = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Store the path to the current dinosaur image globally
current_dino_image = 'dino1.png'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def game():
    global current_dino_image
    return render_template('game.html', image=current_dino_image)

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    global current_dino_image
    if request.method == 'POST':
        if 'image' not in request.files:
            return 'No file part'
        file = request.files['image']
        if file.filename == '':
            return 'No selected file'
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            current_dino_image = os.path.join('uploads', filename)  # Update the current image
            return redirect(url_for('admin'))
    return render_template('admin.html', current_image=current_dino_image)

if __name__ == '__main__':
    app.run(debug=True)
