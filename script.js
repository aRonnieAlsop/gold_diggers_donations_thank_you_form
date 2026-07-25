/*==================================================
  GOLD DIGGERS THANK-YOU GENERATOR
  Indian Valley Chamber of Commerce
  script.js
===================================================*/

"use strict";


/*==================================================
  ELEMENTS
===================================================*/

const thankYouForm =
  document.getElementById("thankYouForm");

const businessNameInput =
  document.getElementById("businessName");

const donationDescriptionInput =
  document.getElementById("donationDescription");

const personalNoteInput =
  document.getElementById("personalNote");


const previewBusinessName =
  document.getElementById("previewBusinessName");

const previewDonationDescription =
  document.getElementById("previewDonationDescription");

const previewPersonalNote =
  document.getElementById("previewPersonalNote");

const previewPersonalNoteParagraph =
  document.getElementById("previewPersonalNoteParagraph");


const thankYouCard =
  document.getElementById("thankYouCard");


const updatePreviewButton =
  document.getElementById("updatePreviewButton");

const downloadImageButton =
  document.getElementById("downloadImageButton");

const copyEmailButton =
  document.getElementById("copyEmailButton");

const copyTextButton =
  document.getElementById("copyTextButton");

const printButton =
  document.getElementById("printButton");

const statusMessage =
  document.getElementById("statusMessage");


/*==================================================
  DEFAULT PLACEHOLDERS
===================================================*/

const DEFAULT_BUSINESS_NAME =
  "[Business or Donor Name]";

const DEFAULT_DONATION_DESCRIPTION =
  "[donation description]";


/*==================================================
  PUBLIC IMAGE ADDRESSES
===================================================*/

/*
  After the project is published on GitHub Pages,
  these automatically become complete HTTPS addresses.

  Example:

  https://username.github.io/repository/gd.png

  While testing from a local file, they may begin with
  file:// and will not work inside a pasted Gmail message.
*/

function getPublicAssetUrl(filename) {

  return new URL(
    filename,
    window.location.href
  ).href;

}


/*==================================================
  GENERAL HELPERS
===================================================*/

function getTrimmedValue(input) {

  return input.value.trim();

}


function escapeHtml(value) {

  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function convertLineBreaksToHtml(value) {

  return escapeHtml(value)
    .replace(/\r?\n/g, "<br>");

}


function createSafeFilename(name) {

  const safeName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return safeName || "gold-diggers-donor";

}


/*==================================================
  STATUS MESSAGES
===================================================*/

function showStatus(message, type = "success") {

  if (!statusMessage) {
    return;
  }

  statusMessage.textContent = message;

  statusMessage.style.color =
    type === "error"
      ? "#ff8f8f"
      : "#58C98D";

  window.clearTimeout(showStatus.timeout);

  showStatus.timeout =
    window.setTimeout(() => {

      statusMessage.textContent = "";

    }, 6000);

}


/*==================================================
  GET CURRENT INFORMATION
===================================================*/

function getThankYouData() {

  return {

    businessName:
      getTrimmedValue(businessNameInput) ||
      DEFAULT_BUSINESS_NAME,

    donationDescription:
      getTrimmedValue(donationDescriptionInput) ||
      DEFAULT_DONATION_DESCRIPTION,

    personalNote:
      getTrimmedValue(personalNoteInput)

  };

}


/*==================================================
  VALIDATE REQUIRED FIELDS
===================================================*/

function validateRequiredFields() {

  const businessName =
    getTrimmedValue(businessNameInput);

  const donationDescription =
    getTrimmedValue(donationDescriptionInput);


  if (!businessName || !donationDescription) {

    showStatus(
      "Please enter both the business name and donation description first.",
      "error"
    );


    if (!businessName) {

      businessNameInput.focus();

    } else {

      donationDescriptionInput.focus();

    }

    return false;

  }

  return true;

}


/*==================================================
  UPDATE PREVIEW
===================================================*/

function updatePreview(showConfirmation = false) {

  const data = getThankYouData();


  previewBusinessName.textContent =
    data.businessName;

  previewDonationDescription.textContent =
    data.donationDescription;


  if (data.personalNote) {

    previewPersonalNote.textContent =
      data.personalNote;

    previewPersonalNoteParagraph
      .classList
      .remove("is-hidden");

  } else {

    previewPersonalNote.textContent = "";

    previewPersonalNoteParagraph
      .classList
      .add("is-hidden");

  }


  adjustBusinessNameSize();


  if (showConfirmation) {

    showStatus(
      "The thank-you preview has been updated."
    );

  }

}


/*==================================================
  LONG BUSINESS NAMES
===================================================*/

function adjustBusinessNameSize() {

  const length =
    previewBusinessName.textContent.length;


  if (length > 45) {

    previewBusinessName.style.fontSize =
      "0.85em";

  } else if (length > 30) {

    previewBusinessName.style.fontSize =
      "0.92em";

  } else {

    previewBusinessName.style.fontSize =
      "1em";

  }

}


/*==================================================
  LIVE PREVIEW
===================================================*/

businessNameInput.addEventListener(
  "input",
  () => updatePreview(false)
);

donationDescriptionInput.addEventListener(
  "input",
  () => updatePreview(false)
);

personalNoteInput.addEventListener(
  "input",
  () => updatePreview(false)
);


/*==================================================
  UPDATE BUTTON
===================================================*/

updatePreviewButton.addEventListener(
  "click",
  () => {

    updatePreview(true);

    thankYouCard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }
);


/*==================================================
  FORM SUBMISSION
===================================================*/

thankYouForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    updatePreview(true);

  }
);


/*==================================================
  RESET FORM
===================================================*/

thankYouForm.addEventListener(
  "reset",
  () => {

    window.setTimeout(() => {

      previewBusinessName.textContent =
        DEFAULT_BUSINESS_NAME;

      previewDonationDescription.textContent =
        DEFAULT_DONATION_DESCRIPTION;

      previewPersonalNote.textContent = "";

      previewPersonalNoteParagraph
        .classList
        .add("is-hidden");

      previewBusinessName.style.fontSize =
        "1em";

      showStatus(
        "Ready for the next thank-you."
      );

      businessNameInput.focus();

    }, 0);

  }
);


/*==================================================
  WAIT FOR IMAGES AND FONTS
===================================================*/

async function prepareCardForExport() {

  updatePreview(false);


  if (
    document.fonts &&
    document.fonts.ready
  ) {

    await document.fonts.ready;

  }


  const images = Array.from(
    thankYouCard.querySelectorAll("img")
  );


  await Promise.all(

    images.map((image) => {

      if (
        image.complete &&
        image.naturalWidth > 0
      ) {

        return Promise.resolve();

      }


      return new Promise(
        (resolve, reject) => {

          image.addEventListener(
            "load",
            resolve,
            { once: true }
          );

          image.addEventListener(
            "error",
            () => {

              reject(
                new Error(
                  `The image "${image.getAttribute("src")}" could not be loaded.`
                )
              );

            },
            { once: true }
          );

        }
      );

    })

  );

}


/*==================================================
  DOWNLOAD AS PNG
===================================================*/

downloadImageButton.addEventListener(
  "click",
  async () => {

    if (!validateRequiredFields()) {
      return;
    }


    if (typeof html2canvas !== "function") {

      showStatus(
        "The image-download library did not load. Check the html2canvas line in index.html.",
        "error"
      );

      return;

    }


    const originalButtonText =
      downloadImageButton.textContent;


    try {

      downloadImageButton.disabled = true;

      downloadImageButton.textContent =
        "Creating PNG...";


      showStatus(
        "Preparing the high-resolution image..."
      );


      await prepareCardForExport();


      const canvas =
        await html2canvas(
          thankYouCard,
          {

            backgroundColor: "#F5EFE4",

            scale: 3,

            useCORS: true,

            allowTaint: false,

            logging: false,

            imageTimeout: 15000,

            scrollX: 0,

            scrollY: -window.scrollY

          }
        );


      const data =
        getThankYouData();


      const filename =
        createSafeFilename(
          data.businessName
        ) +
        "-gold-diggers-thank-you.png";


      const blob =
        await new Promise((resolve) => {

          canvas.toBlob(
            resolve,
            "image/png",
            1
          );

        });


      if (!blob) {

        throw new Error(
          "The PNG could not be created."
        );

      }


      const downloadUrl =
        URL.createObjectURL(blob);

      const downloadLink =
        document.createElement("a");


      downloadLink.href =
        downloadUrl;

      downloadLink.download =
        filename;


      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();

      downloadLink.remove();


      window.setTimeout(() => {

        URL.revokeObjectURL(
          downloadUrl
        );

      }, 1000);


      showStatus(
        "The high-resolution PNG was downloaded."
      );

    } catch (error) {

      console.error(error);

      showStatus(
        "The PNG could not be created. Make sure gd.png and logo.png are in the same folder as index.html.",
        "error"
      );

    } finally {

      downloadImageButton.disabled =
        false;

      downloadImageButton.textContent =
        originalButtonText;

    }

  }
);


/*==================================================
  PLAIN-TEXT MESSAGE
===================================================*/

function createPlainTextMessage() {

  const data =
    getThankYouData();


  const personalNoteSection =
    data.personalNote
      ? `\n\n${data.personalNote}`
      : "";


  return `Dear ${data.businessName},

On behalf of Jennifer Ann Meyers and the Indian Valley Chamber of Commerce, thank you for your generous donation of ${data.donationDescription} to the 2026 Gold Diggers Days raffle.${personalNoteSection}

Your support helped create excitement throughout the event while raising funds that allow the Chamber to continue organizing community events that bring people together and support the future of Indian Valley.

As Greenville continues to rebuild, celebrations like Gold Diggers Days remind us why this community is so special. Because of businesses like yours, neighbors, families, and visitors were able to spend the day making memories, supporting local businesses, and celebrating the resilience and spirit of our valley.

We are sincerely grateful that you chose to be part of this year's event. Your generosity helped make Gold Diggers Days a success, and we look forward to working together again in the future.

With heartfelt thanks,

Jennifer Ann Meyers
Gold Diggers Raffle Coordinator

Indian Valley Chamber of Commerce`;

}


/*==================================================
  FORMATTED EMAIL HTML
===================================================*/

function createEmailHtml() {

  const data =
    getThankYouData();


  const businessName =
    escapeHtml(data.businessName);

  const donationDescription =
    escapeHtml(data.donationDescription);

  const personalNote =
    convertLineBreaksToHtml(
      data.personalNote
    );


  /*
    These become public HTTPS image addresses
    after the page is published on GitHub Pages.
  */

  const headerImageUrl =
    getPublicAssetUrl("gd.png");

  const chamberLogoUrl =
    getPublicAssetUrl("logo.png");


  const personalNoteSection =
    personalNote
      ? `
        <tr>
          <td style="
            padding:0 44px 24px;
          ">
            <div style="
              padding:18px 20px;
              background:#eee5d4;
              border-left:4px solid #b89146;
              color:#1b1b1b;
              font-family:Arial,Helvetica,sans-serif;
              font-size:16px;
              line-height:1.7;
            ">
              ${personalNote}
            </div>
          </td>
        </tr>
      `
      : "";


  return `
    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="
        width:100%;
        margin:0;
        padding:0;
        border-collapse:collapse;
        background:#ffffff;
      "
    >

      <tr>

        <td
          align="center"
          style="
            padding:24px 10px;
          "
        >

          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="680"
            style="
              width:100%;
              max-width:680px;
              border-collapse:collapse;
              background:#f5efe4;
              color:#1b1b1b;
              border:1px solid #ddd1bd;
            "
          >


            <!-- Gold Diggers Image -->

            <tr>

              <td
                align="center"
                style="
                  padding:0;
                  line-height:0;
                "
              >

                <img
                  src="${headerImageUrl}"
                  alt="Gold Diggers Days 2026 Thank You"
                  width="680"
                  style="
                    display:block;
                    width:100%;
                    max-width:680px;
                    height:auto;
                    margin:0;
                    border:0;
                  "
                >

              </td>

            </tr>



            <!-- Recipient -->

            <tr>

              <td
                style="
                  padding:42px 44px 0;
                  color:#1b1b1b;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:16px;
                  line-height:1.7;
                "
              >

                <p style="
                  margin:0 0 22px;
                ">

                  Dear

                  <strong style="
                    color:#8d5a00;
                  ">
                    ${businessName}
                  </strong>,

                </p>


                <p style="
                  margin:0 0 22px;
                ">

                  On behalf of Jennifer Ann Meyers and the
                  Indian Valley Chamber of Commerce, thank
                  you for your generous donation of

                  <strong style="
                    color:#8d5a00;
                  ">
                    ${donationDescription}
                  </strong>

                  to the 2026 Gold Diggers Days raffle.

                </p>

              </td>

            </tr>



            <!-- Optional Note -->

            ${personalNoteSection}



            <!-- Main Message -->

            <tr>

              <td
                style="
                  padding:0 44px;
                  color:#1b1b1b;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:16px;
                  line-height:1.7;
                "
              >

                <p style="
                  margin:0 0 22px;
                ">

                  Your support helped create excitement
                  throughout the event while raising funds
                  that allow the Chamber to continue
                  organizing community events that bring
                  people together and support the future
                  of Indian Valley.

                </p>


                <p style="
                  margin:0 0 22px;
                ">

                  As Greenville continues to rebuild,
                  celebrations like Gold Diggers Days
                  remind us why this community is so
                  special. Because of businesses like
                  yours, neighbors, families, and visitors
                  were able to spend the day making
                  memories, supporting local businesses,
                  and celebrating the resilience and
                  spirit of our valley.

                </p>


                <p style="
                  margin:0 0 22px;
                ">

                  We are sincerely grateful that you chose
                  to be part of this year's event. Your
                  generosity helped make Gold Diggers Days
                  a success, and we look forward to working
                  together again in the future.

                </p>

              </td>

            </tr>



            <!-- Jennifer's Signature -->

            <tr>

              <td
                style="
                  padding:10px 44px 32px;
                  color:#1b1b1b;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:16px;
                  line-height:1.6;
                "
              >

                <p style="
                  margin:0 0 2px;
                ">
                  With heartfelt thanks,
                </p>


                <p style="
                  margin:0;
                  color:#8d5a00;
                  font-family:'Brush Script MT','Segoe Script',cursive;
                  font-size:36px;
                  line-height:1.25;
                ">
                  Jennifer Ann Meyers
                </p>


                <p style="
                  margin:2px 0 0;
                  font-size:13px;
                  font-weight:bold;
                  letter-spacing:1px;
                  text-transform:uppercase;
                ">
                  Gold Diggers Raffle Coordinator
                </p>

              </td>

            </tr>



            <!-- Chamber Signature -->

            <tr>

              <td
                align="center"
                style="
                  padding:28px 30px 35px;
                  background:#111111;
                  color:#ffffff;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:14px;
                  line-height:1.5;
                "
              >

                <img
                  src="${chamberLogoUrl}"
                  alt="Indian Valley Chamber of Commerce"
                  width="100"
                  style="
                    display:block;
                    width:100px;
                    max-width:100px;
                    height:auto;
                    margin:0 auto 12px;
                    border:0;
                  "
                >


                <p style="
                  margin:0;
                  color:#ffffff;
                  font-weight:bold;
                  letter-spacing:1px;
                  text-transform:uppercase;
                ">
                  Indian Valley Chamber of Commerce
                </p>

              </td>

            </tr>


          </table>

        </td>

      </tr>

    </table>
  `;

}


/*==================================================
  COPY FALLBACK
===================================================*/

function copyUsingTemporaryTextarea(text) {

  const textarea =
    document.createElement("textarea");


  textarea.value = text;

  textarea.setAttribute(
    "readonly",
    ""
  );

  textarea.style.position =
    "fixed";

  textarea.style.left =
    "-9999px";

  textarea.style.top =
    "0";


  document.body.appendChild(
    textarea
  );


  textarea.select();

  textarea.setSelectionRange(
    0,
    textarea.value.length
  );


  const copied =
    document.execCommand("copy");


  textarea.remove();


  if (!copied) {

    throw new Error(
      "The browser blocked copying."
    );

  }

}


/*==================================================
  COPY PLAIN TEXT
===================================================*/

copyTextButton.addEventListener(
  "click",
  async () => {

    if (!validateRequiredFields()) {
      return;
    }


    const plainText =
      createPlainTextMessage();


    try {

      if (
        navigator.clipboard &&
        navigator.clipboard.writeText &&
        window.isSecureContext
      ) {

        await navigator.clipboard.writeText(
          plainText
        );

      } else {

        copyUsingTemporaryTextarea(
          plainText
        );

      }


      showStatus(
        "The plain-text thank-you was copied. You can now paste it into an email or document."
      );

    } catch (error) {

      console.error(error);

      showStatus(
        "Your browser blocked automatic copying. Try the published GitHub Pages version in Chrome.",
        "error"
      );

    }

  }
);


/*==================================================
  COPY FORMATTED EMAIL WITH IMAGES
===================================================*/

copyEmailButton.addEventListener(
  "click",
  async () => {

    if (!validateRequiredFields()) {
      return;
    }


    /*
      Public image addresses are required for the
      pictures to remain visible inside Gmail.
    */

    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {

      showStatus(
        "The formatted email image will work after this generator is published on GitHub Pages. The local file version cannot provide Gmail with a public image address.",
        "error"
      );

      return;

    }


    const emailHtml =
      createEmailHtml();

    const plainText =
      createPlainTextMessage();


    try {

      if (
        navigator.clipboard &&
        navigator.clipboard.write &&
        typeof ClipboardItem !== "undefined" &&
        window.isSecureContext
      ) {

        const clipboardItem =
          new ClipboardItem({

            "text/html":
              new Blob(
                [emailHtml],
                {
                  type: "text/html"
                }
              ),

            "text/plain":
              new Blob(
                [plainText],
                {
                  type: "text/plain"
                }
              )

          });


        await navigator.clipboard.write([
          clipboardItem
        ]);


        showStatus(
          "The formatted email—including the Gold Diggers image—was copied. Open Gmail and paste it directly into the message body."
        );

        return;

      }


      copyUsingTemporaryTextarea(
        plainText
      );


      showStatus(
        "Your browser copied the plain-text version. Use the published GitHub Pages generator in Chrome to copy the formatted version with images."
      );

    } catch (error) {

      console.error(error);


      try {

        copyUsingTemporaryTextarea(
          plainText
        );


        showStatus(
          "The browser blocked formatted copying, so the plain-text version was copied instead.",
          "error"
        );

      } catch (fallbackError) {

        console.error(
          fallbackError
        );


        showStatus(
          "The browser blocked copying. Open the published GitHub Pages generator in Chrome and try again.",
          "error"
        );

      }

    }

  }
);


/*==================================================
  PRINT OR SAVE AS PDF
===================================================*/

printButton.addEventListener(
  "click",
  () => {

    if (!validateRequiredFields()) {
      return;
    }


    updatePreview(false);


    showStatus(
      "The print window is opening. Choose “Save as PDF” to create a PDF copy."
    );


    window.setTimeout(() => {

      window.print();

    }, 250);

  }
);


/*==================================================
  DELIVERY-METHOD SELECTION
===================================================*/

const deliveryMethodInputs =
  document.querySelectorAll(
    'input[name="deliveryMethod"]'
  );


deliveryMethodInputs.forEach(
  (input) => {

    input.addEventListener(
      "change",
      () => {

        const methodMessages = {

          image:
            "Image format selected. Use the Download as PNG button below the preview.",

          email:
            "Email format selected. Use the Copy Email Version button below the preview.",

          text:
            "Plain-text format selected. Use the Copy Plain Text button below the preview.",

          print:
            "Print format selected. Use the Print or Save as PDF button below the preview."

        };


        showStatus(
          methodMessages[input.value]
        );

      }
    );

  }
);


/*==================================================
  INITIALIZE
===================================================*/

updatePreview(false);