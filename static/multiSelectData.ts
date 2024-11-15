export const inputsData = [
    { label: "نام و نام خانوادگی", value: { name: "name", type: "text" } },
    { label: "سال تولد", value: { name: "birth", type: "number" } },
    { label: "کد ملی", value: { name: "code", type: "number" } },
    {
      label: "وظعیت نظام وظیفه",
      value: {
        name: "duty",
        type: "select",
        data: ["معافیت دائم", "معافیت تحصیلی", "پایان خدمت"],
      },
    },
    {
      label: "وضعیت تاهل",
      value: { name: "marital", type: "select", data: ["مجرد", "متاهل"] },
    },
    {
      label: "تحصیلات",
      value: {
        name: "education",
        type: "select",
        data: ["زیر دیپلم", "دیپلم", "کاردانی", "کارشناسی", "ارشد", "دکتری"],
      },
    },
    { label: "رشته تحصیلی", value: { name: "field", type: "text" } },
    { label: "دانشگاه", value: { name: "university", type: "text" } },
    { label: "ترم تحصیلی", value: { name: "semester", type: "number" } },
    { label: "شماره تماس", value: { name: "phone", type: "number" } },
    { label: "ایمیل", value: { name: "email", type: "text" } },
    {
      label: "سابقه کار",
      value: {
        name: "history",
        type: "select",
        data: [
          "زیر 2 سال",
          "2 تا 5 سال",
          "5 تا 10سال",
          "10 تا 20 سال",
          "بیش از 20 سال",
        ],
      },
    },
    { label: "توضیحات بیشتر", value: { name: "more", type: "text" } },
    { label: "بارگذاری مدارک", value: { name: "upload", type: "file" } },
  ];