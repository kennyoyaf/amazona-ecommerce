// utils/corsOption.js
module.exports = (req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://amazona-ecommerce.vercel.app",
    "https://amazona-ecommerce-o1bx.vercel.app",
    "https://amazona-ecommerce-rinq.vercel.app",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};
