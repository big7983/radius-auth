import radius from "radius";
import dgram from "dgram";

const RADIUS_SERVER = "192.168.70.98"; // เปลี่ยนเป็น IP ของ RADIUS Server
const RADIUS_SECRET = "testing123"; // ใช้ secret ที่กำหนดใน RADIUS
const RADIUS_PORT = 1812;

export async function authenticateWithRadius(username: string, password: string) {
  return new Promise((resolve, reject) => {
    const packet = {
      code: "Access-Request",
      secret: RADIUS_SECRET,
      attributes: [
        ["User-Name", username],
        ["User-Password", password],
      ],
    };

    const encodedPacket = radius.encode(packet);
    const client = dgram.createSocket("udp4");

    client.send(encodedPacket, 0, encodedPacket.length, RADIUS_PORT, RADIUS_SERVER, (err) => {
      if (err) {
        client.close();
        return reject(err);
      }
    });

    client.on("message", (msg) => {
      const response = radius.decode({ packet: msg, secret: RADIUS_SECRET });

      if (response.code === "Access-Accept") {
        resolve(true); // Authentication สำเร็จ
      } else {
        resolve(false); // Authentication ล้มเหลว
      }

      client.close();
    });

    client.on("error", (err) => {
      client.close();
      reject(err);
    });
  });
}