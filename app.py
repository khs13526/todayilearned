import datetime
import hashlib

import jwt
from flask import Flask, render_template, request , jsonify, redirect,url_for
from bson import ObjectId
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.i3cxp.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.test

SECRET_KEY = '2D2E90DC79DBF44A1D3F6B91A19C66212ACE8433C2ED1E7DC03BB1E335443220'

def objectIdDecoder(list):
    for document in list:
        document['_id'] = str(document['_id'])

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/register')
def register():
    return render_template('register.html')


@app.route('/main')
def mainpage():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"id": payload['id']})
        return render_template('main.html', id = user_info["id"])
    except jwt.ExpiredSignatureError:
        return redirect(url_for("home"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("home"))

@app.route('/api/register', methods=['POST'])
def api_register():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    db.users.insert_one({'id': id_receive, 'pw': pw_hash,})

    return jsonify({'result': 'success'})

@app.route('/api/login', methods=['POST'])
def api_login():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'id':id_receive, 'pw': pw_hash})
    if result is not None:
        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        # 서버에서 실행시 디코딩 필요
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf-8')
        # token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return jsonify({'result': 'success', 'token': token})
    else:
        return jsonify(({'result' : 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'}))

@app.route('/api/post', methods=['POST'])
def api_register_list():
    title_receive = request.form['title_give']
    content_receive = request.form['content_give']
    id_receive = request.form['id_give']
    doc = {
        'userId': id_receive,
        'title': title_receive,
        'content': content_receive
    }
    db.contents.insert_one(doc)
    return jsonify({'msg': '등록되었습니다!'})

@app.route('/api/content', methods=['GET'])
def api_get_list():
    content_list = list(db.contents.find({}))
    objectIdDecoder(content_list)
    return jsonify({'contents': content_list})

@app.route('/api/delete', methods=['POST'])
def api_delete_list():
    id_receive = request.form['id_give']
    userId_receive = request.form['userId_give']
    content = db.contents.find_one({'_id': ObjectId(id_receive)})
    print(userId_receive)
    if content['userId'] == userId_receive:
        db.contents.delete_one({'_id': ObjectId(id_receive)})
        msg = "삭제되었습니다!"
        check = 1
    else:
        msg = "본인이 작성한 글이 아닙니다."
        check = 0
    return jsonify({'msg': msg, 'check': check})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)