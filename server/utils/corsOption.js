// options for cors
module.exports = (req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://amazona-ecommerce-rinq.vercel.app/",
    "https://amazona-ecommerce-o1bx.vercel.app/",
    "https://amazonaecommerce.com",
    "https://www.amazonaecommerce.com",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true"); // Add this line
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "content-type, Authorization");
  next();
};
