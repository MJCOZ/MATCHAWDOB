// ================================================
// تكامل شركة شحن SMSA Express
// وثائق: https://developer.smsa.com
// ================================================

const SMSA_BASE_URL = process.env.SMSA_BASE_URL || "https://track.smsaexpress.com/SECOM";

interface SMSAShipmentParams {
  senderName: string;
  senderCity: string;
  senderPhone: string;
  receiverName: string;
  receiverCity: string;
  receiverPhone: string;
  receiverAddress: string;
  weight: number;
  reference: string;       // رقم الطلب
  cod?: number;            // الدفع عند الاستلام (Cash on Delivery)
  description?: string;
}

// إنشاء شحنة SMSA
export async function createSMSAShipment(params: SMSAShipmentParams) {
  const passkey = process.env.SMSA_PASSKEY;
  if (!passkey) throw new Error("SMSA_PASSKEY غير موجود في .env");

  const soapBody = `
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <addShipment xmlns="http://www.smsaexpress.com/service/">
          <passKey>${passkey}</passKey>
          <shipInfo>
            <Shipper>متجرنا</Shipper>
            <ShipperAddress>${params.senderCity}</ShipperAddress>
            <ShipperCity>${params.senderCity}</ShipperCity>
            <ShipperPhone>${params.senderPhone}</ShipperPhone>
            <ShipperCountry>SA</ShipperCountry>
            <Consignee>${params.receiverName}</Consignee>
            <ConsigneeAddress>${params.receiverAddress}</ConsigneeAddress>
            <ConsigneeCity>${params.receiverCity}</ConsigneeCity>
            <ConsigneePhone>${params.receiverPhone}</ConsigneePhone>
            <ConsigneeCountry>SA</ConsigneeCountry>
            <Weight>${params.weight}</Weight>
            <ItemDesc>${params.description || "بضائع"}</ItemDesc>
            <Reference>${params.reference}</Reference>
            <COD>${params.cod || 0}</COD>
            <CodAmt>${params.cod || 0}</CodAmt>
          </shipInfo>
        </addShipment>
      </soap:Body>
    </soap:Envelope>
  `;

  const response = await fetch(`${SMSA_BASE_URL}/SMSAwebService.asmx`, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: '"http://www.smsaexpress.com/service/addShipment"',
    },
    body: soapBody,
  });

  const text = await response.text();
  // استخراج رقم التتبع من XML
  const awbMatch = text.match(/<addShipmentResult>(.*?)<\/addShipmentResult>/);
  const trackingNumber = awbMatch?.[1];

  if (!trackingNumber || trackingNumber === "null") {
    throw new Error(`SMSA Error: فشل إنشاء الشحنة`);
  }

  return { trackingNumber, raw: text };
}

// تتبع شحنة SMSA
export async function trackSMSAShipment(trackingNumber: string) {
  const passkey = process.env.SMSA_PASSKEY;
  if (!passkey) throw new Error("SMSA_PASSKEY غير موجود في .env");

  const soapBody = `
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <getTracking xmlns="http://www.smsaexpress.com/service/">
          <passKey>${passkey}</passKey>
          <awbNo>${trackingNumber}</awbNo>
        </getTracking>
      </soap:Body>
    </soap:Envelope>
  `;

  const response = await fetch(`${SMSA_BASE_URL}/SMSAwebService.asmx`, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: '"http://www.smsaexpress.com/service/getTracking"',
    },
    body: soapBody,
  });

  const text = await response.text();
  return { raw: text };
}
