import admin from 'firebase-admin';

const serviceAccount = {
  projectId: 'manvaasam-h50ej',
  privateKey: `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwuTJyjBcgzIbw\nWkTtqwnBisT5XlFapMFysGtIupccf0pvDuDMr1k15feLzVcXk+BSrzzxP8m+/ncD\nghnr1TJB1k2r0uyIJSFyzNcOA8Lev2OfzWmLfZgCW9kURxQuWRMNgRAWrA1hbpOd\n278rRVQc+kHgy7RBv5dRcOXTVQXvt1xvkmVWO0YiMyCq/L1IusIjemDz4jvvgNJH\nR3Rx/AYnDtLD4Q7ZJPX54FRBo/OWSmL3jnFE+B0ZOJlm1uOUxY7Kp2+/7NDnfJTQ\nYp8kS0VCa9w77JDfZg75OA2m5UVU3YCie0RI5IM/h2P/e80YvsCkvBxZN+US4liQ\nHS+td90JAgMBAAECggEABHr1ffTyQykcRKytMa9T5H29p6rN+jPSGbPCTIo6eYT6\noJ0qctYBN34YjAlNK3Jazg3WSDF7TmXKI6MhQBrcFtI1juUejQcP9Yae7yKGRrpo\nbq04/0nUWD723m484z3r3zxF6aU8A5vXjzl6e8DatI9dqzLO45nVXsGzeeueZmjf\nUNAzPL3g9C5cvPJFvHlfjxQ6tdxYNLykwTZk7ZLDsm/FEla4WgnUfbjTNivQXn1X\n8Bzk0ttMPhjQ/7hmNw49mX84lhK24GzuaDZPD/hfBIa6xB++r8H0qFN6yRoEL915\nMm61cDvT7GJt1OSVQLu6hoTvbM7YOB1DMKVTRe1qWQKBgQDpS+IRRHqOVCh6gVmZ\n+91KLVA8Y1GB7vtTPNR3LEfutiZ+cDV3vZzyTq5VZAbvw7sCYV1PW+XekkYx75b4\nmIq5TYcmKP5TjdFBh503HzSLlNBvNQF05sk/1nqJnKIi22cVw+J6km3hTrwvM71K\nlJz+PYIed6CkAJ2KqIqvLdrLLQKBgQDB6+kFa/KIL4YnngqSqRBPI2tF6Jy7/hRT\n2B6v7ihg57Tdv1NZ+dZbt1GXeuw0YyERoO0d8V9r/wqUX7EFVulNjkGh6GRxnmre\noBmRRQqOFwkBz8HEw0eeBMBFoEmPu9hmuVMWc8inm9e68ql0rW1y3Gib2bD7IF6k\neMnAUyISzQKBgC/vkaHuqif4juCtF1YWdF+7c9MUrTi/fBCcXSOni5g3AS3VrIbQ\nBSGcnSGajfpSA2j3zI5z2YWkFJxKGIE4BrkQfwaOQcO1Thvi26Dp3ogXqcRP5d65\nVPyy+zavYnk7D7FfMHfzAnTbEru4K9rZMnDi/ot4FR/dqIFHJEfeaih5AoGAEY+6\nr4oCEcE0Bfxy+qsi1ffgLBmPsBqnXpxw0v/fWj9Bit9bvgc5GV81nWE9aNUdVopb\nTt3gBVi4bY1o65HeWO6sFOyFxCBTj0uyZQx6kzmU0DwvURFaN/44J1YHs2OQimT4\nGE1t+3fKhpyZKf7WrZM2Sf7h3ywkRgLGSot8x3UCgYArqzA/ozLPv18m14VJw9D8\nBBFoqjj0B/rzviSevwRGkNkSzOmOSjirQWbTCwvzm6X8+f7PEqhXLDlulgIM/CT8\nXC+U+Y1INLz70AxPgvUwRz/9BZDkMWBBQTZhSvLhJ0BGBbFk0pEDA9L7IvcMwqIQ\nN8tYMy+QYalUf1rqSsU6SA==\n-----END PRIVATE KEY-----\n`,
  clientEmail: 'firebase-adminsdk-fbsvc@manvaasam-h50ej.iam.gserviceaccount.com',
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('✅ Firebase Admin initialized with hardcoded credentials');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
  }
}

export default admin;
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
