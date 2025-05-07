export const env = {
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb+srv://samuelaondo10:11620sam@lalavista.k4rm0zc.mongodb.net/?retryWrites=true&w=majority&appName=lalavista",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "your-nextauth-secret",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  ADMIN_EMAIL: "admin@lalavista.com",
  ADMIN_PASSWORD: "11620sam",
}
