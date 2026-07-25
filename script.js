/*==================================================
  GOLD DIGGERS THANK-YOU GENERATOR
  Indian Valley Chamber of Commerce
  script.js
===================================================*/

"use strict";


/*==================================================
  WAIT UNTIL THE PAGE IS READY
===================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==============================================
      ELEMENTS
    ===============================================*/

    const form = document.getElementById("thankYouForm");

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

    const resetButton =
        document.getElementById("resetButton");

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


    /*==============================================
      CHECK THAT THE HTML IS CONNECTED
    ===============================================*/

    const requiredElements = [
        form,
        businessNameInput,
        donationDescriptionInput,
        personalNoteInput,
        previewBusinessName,
        previewDonationDescription,
        previewPersonalNote,
        previewPersonalNoteParagraph,
        thankYouCard,
        updatePreviewButton,
        resetButton,
        downloadImageButton,
        copyEmailButton,
        copyTextButton,
        printButton,
        statusMessage
    ];

    if (requiredElements.some(element => !element)) {

        console.error(
            "The thank-you generator could not start because one or more HTML elements are missing."
        );

        return;
    }


    /*==============================================
      STANDARD THANK-YOU TEXT
    ===============================================*/

    const chamberParagraphOne =
        "Your support helped create excitement throughout the event while raising funds that allow the Chamber to continue organizing community events that bring people together and support the future of Indian Valley.";

    const chamberParagraphTwo =
        "As Greenville continues to rebuild, celebrations like Gold Diggers Days remind us why this community is so special. Because of businesses like yours, neighbors, families, and visitors were able to spend the day making memories, supporting local businesses, and celebrating the resilience and spirit of our valley.";

    const chamberParagraphThree =
        "We are sincerely grateful that you chose to be part of this year's event. Your generosity helped make Gold Diggers Days a success, and we look forward to working together again in the future.";


    /*==============================================
      CLEAN USER INPUT
    ===============================================*/

    function cleanText(value) {

        return value
            .replace(/\s+/g, " ")
            .trim();

    }


    /*==============================================
      GET CURRENT INFORMATION
    ===============================================*/

    function getFormValues() {

        return {
            businessName:
                cleanText(businessNameInput.value),

            donationDescription:
                cleanText(donationDescriptionInput.value),

            personalNote:
                cleanText(personalNoteInput.value)
        };

    }


    /*==============================================
      DISPLAY STATUS MESSAGE
    ===============================================*/

    let statusTimer;

    function showStatus(message, type = "success") {

        clearTimeout(statusTimer);

        statusMessage.textContent = message;

        statusMessage.classList.remove(
            "status-message--success",
            "status-message--error"
        );

        statusMessage.classList.add(
            type === "error"
                ? "status-message--error"
                : "status-message--success"
        );

        statusTimer = window.setTimeout(() => {

            statusMessage.textContent = "";

            statusMessage.classList.remove(
                "status-message--success",
                "status-message--error"
            );

        }, 5000);

    }


    /*==============================================
      UPDATE THE PREVIEW
    ===============================================*/

    function updatePreview(showConfirmation = false) {

        const {
            businessName,
            donationDescription,
            personalNote
        } = getFormValues();


        previewBusinessName.textContent =
            businessName || "[Business or Donor Name]";


        previewDonationDescription.textContent =
            donationDescription || "[donation description]";


        if (personalNote) {

            previewPersonalNote.textContent =
                personalNote;

            previewPersonalNoteParagraph.classList.remove(
                "is-hidden"
            );

        } else {

            previewPersonalNote.textContent = "";

            previewPersonalNoteParagraph.classList.add(
                "is-hidden"
            );

        }


        if (showConfirmation) {

            showStatus("The thank-you preview has been updated.");

        }

    }


    /*==============================================
      AUTOMATIC LIVE PREVIEW
    ===============================================*/

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


    /*==============================================
      UPDATE BUTTON
    ===============================================*/

    updatePreviewButton.addEventListener("click", () => {

        updatePreview(true);

        thankYouCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });


    /*==============================================
      PREVENT FORM SUBMISSION
    ===============================================*/

    form.addEventListener("submit", event => {

        event.preventDefault();

        updatePreview(true);

    });


    /*==============================================
      RESET FOR NEXT DONOR
    ===============================================*/

    resetButton.addEventListener("click", () => {

        window.setTimeout(() => {

            previewBusinessName.textContent =
                "[Business or Donor Name]";

            previewDonationDescription.textContent =
                "[donation description]";

            previewPersonalNote.textContent = "";

            previewPersonalNoteParagraph.classList.add(
                "is-hidden"
            );

            const imageOption = document.querySelector(
                'input[name="deliveryMethod"][value="image"]'
            );

            if (imageOption) {

                imageOption.checked = true;

            }

            businessNameInput.focus();

            showStatus(
                "The form is ready for the next business or donor."
            );

        }, 0);

    });


    /*==============================================
      CHECK REQUIRED PERSONALIZATION
    ===============================================*/

    function validatePersonalization() {

        const {
            businessName,
            donationDescription
        } = getFormValues();


        if (!businessName) {

            businessNameInput.focus();

            showStatus(
                "Please enter the business or donor name first.",
                "error"
            );

            return false;

        }


        if (!donationDescription) {

            donationDescriptionInput.focus();

            showStatus(
                "Please describe what the business or donor contributed.",
                "error"
            );

            return false;

        }


        return true;

    }


    /*==============================================
      WAIT FOR ALL CARD IMAGES
    ===============================================*/

    async function waitForCardImages() {

        const images =
            Array.from(thankYouCard.querySelectorAll("img"));

        await Promise.all(
            images.map(image => {

                if (image.complete && image.naturalWidth > 0) {

                    return Promise.resolve();

                }

                return new Promise((resolve, reject) => {

                    image.addEventListener(
                        "load",
                        resolve,
                        { once: true }
                    );

                    image.addEventListener(
                        "error",
                        () => reject(
                            new Error(
                                `The image "${image.src}" could not be loaded.`
                            )
                        ),
                        { once: true }
                    );

                });

            })
        );

    }


    /*==============================================
      BUILD SAFE DOWNLOAD FILENAME
    ===============================================*/

    function createFilename() {

        const { businessName } = getFormValues();

        const safeBusinessName = businessName
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        return safeBusinessName
            ? `gold-diggers-thank-you-${safeBusinessName}.png`
            : "gold-diggers-thank-you.png";

    }


    /*==============================================
      DOWNLOAD CARD AS PNG
    ===============================================*/

    downloadImageButton.addEventListener(
        "click",
        async () => {

            if (!validatePersonalization()) {

                return;

            }

            updatePreview(false);

            if (typeof window.html2canvas !== "function") {

                showStatus(
                    "The image-download library did not load. Check the html2canvas script in index.html.",
                    "error"
                );

                console.error(
                    "html2canvas is unavailable."
                );

                return;

            }


            downloadImageButton.disabled = true;
            downloadImageButton.textContent =
                "Creating PNG…";

            showStatus(
                "Creating the high-resolution thank-you image…"
            );


            try {

                await document.fonts.ready;

                await waitForCardImages();


                const canvas = await window.html2canvas(
                    thankYouCard,
                    {
                        scale: 3,
                        useCORS: true,
                        allowTaint: false,
                        backgroundColor: "#F5EFE4",
                        logging: false,
                        imageTimeout: 15000,
                        removeContainer: true,
                        scrollX: 0,
                        scrollY: -window.scrollY,
                        windowWidth:
                            document.documentElement.scrollWidth
                    }
                );


                canvas.toBlob(blob => {

                    if (!blob) {

                        showStatus(
                            "The PNG could not be created.",
                            "error"
                        );

                        return;

                    }

                    const downloadUrl =
                        URL.createObjectURL(blob);

                    const link =
                        document.createElement("a");

                    link.href = downloadUrl;

                    link.download = createFilename();

                    document.body.appendChild(link);

                    link.click();

                    link.remove();

                    URL.revokeObjectURL(downloadUrl);

                    showStatus(
                        "The PNG has been downloaded."
                    );

                }, "image/png", 1);

            } catch (error) {

                console.error(error);

                showStatus(
                    "The PNG could not be created. Make sure both image files are in the same folder as index.html.",
                    "error"
                );

            } finally {

                downloadImageButton.disabled = false;

                downloadImageButton.textContent =
                    "Download as PNG";

            }

        }
    );


    /*==============================================
      CREATE PLAIN-TEXT MESSAGE
    ===============================================*/

    function createPlainTextMessage() {

        const {
            businessName,
            donationDescription,
            personalNote
        } = getFormValues();


        const paragraphs = [

            `Dear ${businessName},`,

            `On behalf of Jennifer Ann Meyers and the Indian Valley Chamber of Commerce, thank you for your generous donation of ${donationDescription} to the 2026 Gold Diggers Days raffle.`

        ];


        if (personalNote) {

            paragraphs.push(personalNote);

        }


        paragraphs.push(
            chamberParagraphOne,
            chamberParagraphTwo,
            chamberParagraphThree,
            "With heartfelt thanks,",
            "Jennifer Ann Meyers",
            "Gold Diggers Raffle Coordinator",
            "Indian Valley Chamber of Commerce"
        );


        return paragraphs.join("\n\n");

    }


    /*==============================================
      ESCAPE HTML
    ===============================================*/

    function escapeHtml(value) {

        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /*==============================================
      CREATE EMAIL HTML
    ===============================================*/

    function createEmailHtml() {

        const {
            businessName,
            donationDescription,
            personalNote
        } = getFormValues();


        const safeBusinessName =
            escapeHtml(businessName);

        const safeDonationDescription =
            escapeHtml(donationDescription);

        const safePersonalNote =
            escapeHtml(personalNote);


        const optionalPersonalNote = personalNote
            ? `
                <p style="
                    margin:24px 0;
                    padding:18px 20px;
                    border-left:4px solid #B89146;
                    background:#EEE5D4;
                    color:#1B1B1B;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:16px;
                    line-height:1.7;
                ">
                    ${safePersonalNote}
                </p>
            `
            : "";


        return `
            <div style="
                width:100%;
                max-width:720px;
                margin:0 auto;
                background:#F5EFE4;
                color:#1B1B1B;
                font-family:Arial,Helvetica,sans-serif;
                font-size:16px;
                line-height:1.75;
            ">

                <div style="
                    padding:34px 40px;
                    background:#111111;
                    color:#FFFFFF;
                    text-align:center;
                    border-bottom:5px solid #B89146;
                ">

                    <div style="
                        margin-bottom:5px;
                        color:#D6B36A;
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:12px;
                        font-weight:bold;
                        letter-spacing:3px;
                        text-transform:uppercase;
                    ">
                        Gold Diggers Days 2026
                    </div>

                    <div style="
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:38px;
                        font-weight:bold;
                        letter-spacing:5px;
                        text-transform:uppercase;
                    ">
                        Thank You
                    </div>

                </div>


                <div style="padding:42px 48px;">

                    <p style="
                        margin:0 0 22px;
                        font-size:19px;
                        font-weight:bold;
                    ">
                        Dear
                        <span style="color:#8D5A00;">
                            ${safeBusinessName}
                        </span>,
                    </p>


                    <p style="margin:0 0 22px;">
                        On behalf of Jennifer Ann Meyers and the
                        Indian Valley Chamber of Commerce, thank you
                        for your generous donation of
                        <strong style="color:#8D5A00;">
                            ${safeDonationDescription}
                        </strong>
                        to the 2026 Gold Diggers Days raffle.
                    </p>


                    ${optionalPersonalNote}


                    <p style="margin:0 0 22px;">
                        ${chamberParagraphOne}
                    </p>


                    <p style="margin:0 0 22px;">
                        ${chamberParagraphTwo}
                    </p>


                    <p style="margin:0 0 22px;">
                        ${chamberParagraphThree}
                    </p>


                    <div style="margin-top:38px;">

                        <p style="margin:0 0 5px;">
                            With heartfelt thanks,
                        </p>

                        <p style="
                            margin:0;
                            color:#8D5A00;
                            font-family:Georgia,'Times New Roman',serif;
                            font-size:29px;
                            font-style:italic;
                        ">
                            Jennifer Ann Meyers
                        </p>

                        <p style="
                            margin:2px 0 0;
                            font-size:14px;
                            font-weight:bold;
                            letter-spacing:1px;
                            text-transform:uppercase;
                        ">
                            Gold Diggers Raffle Coordinator
                        </p>

                        <p style="
                            margin:30px 0 0;
                            font-size:15px;
                            font-weight:bold;
                        ">
                            Indian Valley Chamber of Commerce
                        </p>

                    </div>

                </div>

            </div>
        `;

    }


    /*==============================================
      FALLBACK TEXT COPY
    ===============================================*/

    function fallbackCopyText(text) {

        const temporaryTextArea =
            document.createElement("textarea");

        temporaryTextArea.value = text;

        temporaryTextArea.setAttribute(
            "readonly",
            ""
        );

        temporaryTextArea.style.position =
            "fixed";

        temporaryTextArea.style.left =
            "-9999px";

        document.body.appendChild(
            temporaryTextArea
        );

        temporaryTextArea.select();

        temporaryTextArea.setSelectionRange(
            0,
            temporaryTextArea.value.length
        );

        const successful =
            document.execCommand("copy");

        temporaryTextArea.remove();

        return successful;

    }


    /*==============================================
      COPY PLAIN TEXT
    ===============================================*/

    copyTextButton.addEventListener(
        "click",
        async () => {

            if (!validatePersonalization()) {

                return;

            }

            const plainText =
                createPlainTextMessage();


            try {

                if (
                    navigator.clipboard &&
                    window.isSecureContext
                ) {

                    await navigator.clipboard.writeText(
                        plainText
                    );

                } else {

                    const copied =
                        fallbackCopyText(plainText);

                    if (!copied) {

                        throw new Error(
                            "The fallback copy command failed."
                        );

                    }

                }

                showStatus(
                    "The plain-text thank-you has been copied."
                );

            } catch (error) {

                console.error(error);

                showStatus(
                    "The browser blocked copying. Try running the page through GitHub Pages or Live Server.",
                    "error"
                );

            }

        }
    );


    /*==============================================
      COPY FORMATTED EMAIL
    ===============================================*/

    copyEmailButton.addEventListener(
        "click",
        async () => {

            if (!validatePersonalization()) {

                return;

            }

            const emailHtml =
                createEmailHtml();

            const plainText =
                createPlainTextMessage();


            try {

                if (
                    navigator.clipboard &&
                    window.ClipboardItem &&
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
                        "The formatted email has been copied. Paste it directly into Gmail."
                    );

                    return;

                }


                const temporaryContainer =
                    document.createElement("div");

                temporaryContainer.innerHTML =
                    emailHtml;

                temporaryContainer.style.position =
                    "fixed";

                temporaryContainer.style.left =
                    "-9999px";

                temporaryContainer.style.top =
                    "0";

                document.body.appendChild(
                    temporaryContainer
                );


                const range =
                    document.createRange();

                range.selectNodeContents(
                    temporaryContainer
                );


                const selection =
                    window.getSelection();

                selection.removeAllRanges();

                selection.addRange(range);


                const successful =
                    document.execCommand("copy");

                selection.removeAllRanges();

                temporaryContainer.remove();


                if (!successful) {

                    throw new Error(
                        "Formatted copying failed."
                    );

                }


                showStatus(
                    "The formatted email has been copied. Paste it directly into Gmail."
                );

            } catch (error) {

                console.error(error);

                const copied =
                    fallbackCopyText(plainText);

                if (copied) {

                    showStatus(
                        "Your browser copied the plain-text version instead of the formatted version."
                    );

                } else {

                    showStatus(
                        "The browser blocked copying. Try GitHub Pages or VS Code Live Server.",
                        "error"
                    );

                }

            }

        }
    );


    /*==============================================
      PRINT OR SAVE AS PDF
    ===============================================*/

    printButton.addEventListener("click", () => {

        if (!validatePersonalization()) {

            return;

        }

        updatePreview(false);

        showStatus(
            "Opening the print window. Choose “Save as PDF” to create a PDF."
        );

        window.setTimeout(() => {

            window.print();

        }, 250);

    });


    /*==============================================
      DELIVERY METHOD BUTTON BEHAVIOR
    ===============================================*/

    const deliveryOptions =
        document.querySelectorAll(
            'input[name="deliveryMethod"]'
        );


    deliveryOptions.forEach(option => {

        option.addEventListener("change", () => {

            const selectedMethod =
                document.querySelector(
                    'input[name="deliveryMethod"]:checked'
                )?.value;


            switch (selectedMethod) {

                case "image":

                    downloadImageButton.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });

                    break;


                case "email":

                    copyEmailButton.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });

                    break;


                case "text":

                    copyTextButton.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });

                    break;


                case "print":

                    printButton.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });

                    break;

            }

        });

    });


    /*==============================================
      INITIALIZE PREVIEW
    ===============================================*/

    updatePreview(false);

});