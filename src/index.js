import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";  // Make sure to import `app` from `app.js`


dotenv.config({
    path: "./.env"
});

// Connect to MongoDB and start the server
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server is running on port", process.env.PORT || 8000);
    });
})
.catch((error) => {
    console.log("MongoDB connection failed", error);
    process.exit(1);
});

app.get("/", (req, res) => {
    res.send("Hello World");
});



app.get("/try", (req, res) => {
    // Ensure that the path is absolute
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Page</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-gray-100 flex items-center justify-center h-screen">
            <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
                <form id="loginForm">
                    <div class="mb-4">
                        <label for="email" class="block text-gray-700">Email</label>
                        <input type="email" id="email" name="email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div class="mb-6">
                        <label for="password" class="block text-gray-700">Password</label>
                        <input type="password" id="password" name="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Login</button>
                </form>
            </div>
     <script>
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Email:', email);
        console.log('Password:', password);

        fetch('/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
</script>
        </body>
        </html>
    `)});


    app.post("/data", (req, res) => {
        const { email, password } = req.body;
        console.log('Email:', email);
        console.log('Password   :', password);
});

