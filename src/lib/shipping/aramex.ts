// ================================================
// تكامل شركة شحن Aramex
// وثائق: https://www.aramex.com/developers
// ================================================

const ARAMEX_BASE_URL = "https://ws.aramex.net/ShippingAPI.V2";

interface AramexAddress {
  Line1: string;
  City: string;
  CountryCode: string;
  Phone: string;
}

interface ShipmentDetails {
  senderName: string;
  senderAddress: AramexAddress;
  receiverName: string;
  receiverAddress: AramexAddress;
  weight: number;          // الوزن بالكيلوجرام
  description: string;
  numberOfPieces: number;
  reference: string;       // رقم الطلب
}

// إنشاء شحنة جديدة
export async function createAramexShipment(details: ShipmentDetails) {
  // بيانات الحساب من .env
  const clientInfo = {
    UserName: process.env.ARAMEX_USERNAME,
    Password: process.env.ARAMEX_PASSWORD,
    Version: "v1.0",
    AccountNumber: process.env.ARAMEX_ACCOUNT_NUMBER,
    AccountPin: process.env.ARAMEX_ACCOUNT_PIN,
    AccountEntity: process.env.ARAMEX_ACCOUNT_ENTITY || "AMM",
    AccountCountryCode: process.env.ARAMEX_ACCOUNT_COUNTRY_CODE || "SA",
    Source: 24,
  };

  if (!clientInfo.UserName || !clientInfo.Password) {
    throw new Error("بيانات Aramex غير موجودة في .env");
  }

  const payload = {
    ClientInfo: clientInfo,
    LabelInfo: { ReportID: 9729, ReportType: "URL" },
    Shipments: [
      {
        Shipper: {
          Reference1: details.reference,
          AccountNumber: clientInfo.AccountNumber,
          PartyAddress: details.senderAddress,
          Contact: {
            Department: "",
            PersonName: details.senderName,
            Title: "",
            CompanyName: "متجرنا",
            PhoneNumber1: details.senderAddress.Phone,
            EmailAddress: process.env.SMTP_USER || "",
          },
        },
        Consignee: {
          Reference1: details.reference,
          AccountNumber: "",
          PartyAddress: details.receiverAddress,
          Contact: {
            PersonName: details.receiverName,
            PhoneNumber1: details.receiverAddress.Phone,
          },
        },
        ShippingDateTime: new Date().toISOString(),
        DueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        Details: {
          Dimensions: { Length: 0, Width: 0, Height: 0, Unit: "CM" },
          ActualWeight: { Value: details.weight, Unit: "KG" },
          ChargeableWeight: { Value: details.weight, Unit: "KG" },
          DescriptionOfGoods: details.description,
          GoodsOriginCountry: "SA",
          NumberOfPieces: details.numberOfPieces,
          ProductGroup: "EXP",
          ProductType: "PDX",
          PaymentType: "P",
          PaymentOptions: "",
          Services: "",
        },
      },
    ],
  };

  const response = await fetch(`${ARAMEX_BASE_URL}/Shipping/Service_1_0.svc/json/CreateShipments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (result.HasErrors) {
    throw new Error(`Aramex Error: ${JSON.stringify(result.Notifications)}`);
  }

  return {
    trackingNumber: result.Shipments?.[0]?.ID,
    labelUrl: result.Shipments?.[0]?.ShipmentLabel?.LabelURL,
    raw: result,
  };
}

// تتبع شحنة
export async function trackAramexShipment(trackingNumber: string) {
  const clientInfo = {
    UserName: process.env.ARAMEX_USERNAME,
    Password: process.env.ARAMEX_PASSWORD,
    Version: "v1.0",
    AccountNumber: process.env.ARAMEX_ACCOUNT_NUMBER,
    AccountPin: process.env.ARAMEX_ACCOUNT_PIN,
    AccountEntity: process.env.ARAMEX_ACCOUNT_ENTITY || "AMM",
    AccountCountryCode: process.env.ARAMEX_ACCOUNT_COUNTRY_CODE || "SA",
    Source: 24,
  };

  const response = await fetch(`${ARAMEX_BASE_URL}/Tracking/Service_1_0.svc/json/TrackShipments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ClientInfo: clientInfo,
      GetLastTrackingUpdateOnly: false,
      Shipments: [trackingNumber],
    }),
  });

  const result = await response.json();

  if (result.HasErrors) {
    throw new Error(`Aramex Tracking Error: ${JSON.stringify(result.Notifications)}`);
  }

  const trackingData = result.TrackingResults?.[0]?.Value;
  return {
    status: trackingData?.[0]?.UpdateDescription || "غير معروف",
    updates: trackingData?.map((item: any) => ({
      date: item.UpdateDateTime,
      location: item.UpdateLocation,
      description: item.UpdateDescription,
    })),
    raw: result,
  };
}

// حساب تكلفة الشحن
export async function calculateAramexRate(
  originCity: string,
  destinationCity: string,
  weight: number
) {
  const clientInfo = {
    UserName: process.env.ARAMEX_USERNAME,
    Password: process.env.ARAMEX_PASSWORD,
    Version: "v1.0",
    AccountNumber: process.env.ARAMEX_ACCOUNT_NUMBER,
    AccountPin: process.env.ARAMEX_ACCOUNT_PIN,
    AccountEntity: process.env.ARAMEX_ACCOUNT_ENTITY || "AMM",
    AccountCountryCode: process.env.ARAMEX_ACCOUNT_COUNTRY_CODE || "SA",
    Source: 24,
  };

  const response = await fetch(`${ARAMEX_BASE_URL}/RateCalculator/Service_1_0.svc/json/CalculateRate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ClientInfo: clientInfo,
      OriginAddress: { City: originCity, CountryCode: "SA" },
      OriginLocation: null,
      DestinationAddress: { City: destinationCity, CountryCode: "SA" },
      DestinationLocation: null,
      ShipmentDetails: {
        Dimensions: null,
        ActualWeight: { Value: weight, Unit: "KG" },
        ChargeableWeight: null,
        DescriptionOfGoods: "بضائع",
        GoodsOriginCountry: "SA",
        NumberOfPieces: 1,
        ProductGroup: "EXP",
        ProductType: "PDX",
        PaymentType: "P",
        PaymentOptions: "",
        Services: "",
      },
    }),
  });

  const result = await response.json();
  return result.TotalAmount?.Value || 0;
}
