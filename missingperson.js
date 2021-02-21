var form = document.getElementById("missingperson")

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection("users").doc().set({
        
        name: form["name"].value, 
        age: form["age"].value,
        email: form["email"].value,
        phone:  form["phone"].value
     });
})