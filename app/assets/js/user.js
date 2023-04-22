function login(){
    fetch("/login", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "admin",
            pwd:"admin"
        })
    })
}