from flask import Flask, json, jsonify, render_template, request
import data

app = Flask(__name__)
# nepieciešams garum- un mīkstinājumzīmēm json formātā
app.config['JSON_AS_ASCII'] = False

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/admin')
def admin():
    return render_template("admin.html")

@app.route('/pieteikt')
def pieteikt():
    return render_template("pieteikt.html")

@app.route('/klase')
def klase(kabID):
    return render_template("pieteikt.html")

@app.route('/klase/<kabID>', methods=['GET'])
def pieteikt(kabID):
    # Noklusēta vērtība, ja viela netiks atrasta
    viela = "Kabinets ar ID {} neeksistē".format(kabID)
    
    # atveram datni
    with open("data/tehnika.json", "r") as f:
        # ielasām un pārvēršam par json
        dati = json.loads(f.read())

    # meklējam vielu sarakstā
    for v in dati:
        # vielas ID ir skaitlis, jāpārveido datu tips
        if v["id"] == int(kabID):
            viela = v
    return jsonify(viela)


@app.route('/klases')
def klases():
    return render_template("klases.html")

@app.route('/tehnika')
def tehnika():
    return render_template("tehnika.html")

@app.route('tehnika/pievienot',methods=['POST'])
def pievienot():
    return render_template("pievienot.html")

@app.route('tehnika/problema')
def problema():
    return render_template("problema.html")

@app.route('/api/v1/vielas', methods=['GET'])
def vielas():
    # atveram datni
    with open("dati/vielas.json", "r") as f:
        # ielasām un pārvēršam par json
        dati = json.loads(f.read())
    
    # pārveidojam par string pirms atgriežam
    return jsonify(dati)


@app.route('/api/v1/viela/<vielasID>', methods=['GET'])
def viela_id(vielasID):
    # Noklusēta vērtība, ja viela netiks atrasta
    viela = "Viela ar ID {} neeksistē".format(vielasID)
    
    # atveram datni
    with open("dati/vielas.json", "r") as f:
        # ielasām un pārvēršam par json
        dati = json.loads(f.read())

    # meklējam vielu sarakstā
    for v in dati:
        # vielas ID ir skaitlis, jāpārveido datu tips
        if v["id"] == int(vielasID):
            viela = v
    return jsonify(viela)


@app.route('/api/v1/viela',methods=['POST'])
def jauna_viela():
    # atveram datni, lai ielasītu esošos datus
    with open("dati/vielas.json", "r", encoding='utf-8') as f:
        # ielasām un pārvēršam par json
        dati = json.loads(f.read())
    
    # atrodam lielāko vielas ID
    lielais_id = 1
    for viela in dati:
        if viela["id"] > lielais_id:
            lielais_id = viela["id"]

    # ielasām ienākošos datus un pārvēršam par json
    jauna_viela = json.loads(request.data)
    # šeit vajadzētu veikt pārbaudi vai ir visi nepieciešamie dati
    if len(jauna_viela) < 7:
        return jsonify("Aizpildiet visus laukus!")
    if len(jauna_viela["nosaukums"]) < 3:
        return jsonify("Vielas nosaukums ir par īsu!")
    
    # ja viss ir OK, pievienojam jauno id
    jauna_viela["id"] = lielais_id + 1
    # pievienojam jauno vielu pie datiem
    dati.append(jauna_viela)
    # ierakstam atjaunotos datus atpakaļ datnē
    with open("dati/vielas.json", "w", encoding='utf-8') as f:
        # ielasām un pārvēršam par json
        # šeit nevar izmantot jsonify, jo rakstām datnē nevis atgriežam no Flask
        f.write(json.dumps(dati))
    # atgriežam jauno ID
    return jsonify(lielais_id+1)


if __name__ == "__main__":
    app.run("0.0.0.0", debug=True)