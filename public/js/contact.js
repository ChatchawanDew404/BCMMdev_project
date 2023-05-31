const contactName = document.querySelector("#contact-name");
const contactEmail = document.querySelector("#contact-email");
const contactSubject = document.querySelector("#contact-subject");
const contactMessage = document.querySelector("#contact-message");
const contactBtn = document.querySelector(".contact-btn");

const deleteContactBtn = document.querySelectorAll(".delete-contact");

if (contactBtn) {
  contactBtn.addEventListener("click", (event) => {
    event.preventDefault();
    //check if user put all data in input
    checkKey = contactCheckMessage([
      contactName,
      contactEmail,
      contactSubject,
      contactMessage,
    ]);
    if (checkKey) {
      if (!checkEmail(contactEmail.value.trim())) {
        contactErrorMessage(
          contactEmail,
          "Please enter correct email information."
        );
      } else {
        let contactData = {
          username: contactName.value.trim(),
          email: contactEmail.value.trim(),
          subject: contactSubject.value.trim(),
          message: contactMessage.value.trim(),
          contactDate: new Date(),
        };

        // send delete contact to server
        fetch("/contactData", {
          method: "POST",
          body: JSON.stringify(contactData),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((json) => console.log(json));

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your contact information has been sent.",
          text: "Your information will be verified and we will contact you via email.",
          showConfirmButton: true,
          // timer: 5000
        });

        contactName.value = "";
        contactEmail.value = "";
        contactSubject.value = "";
        contactMessage.value = "";
      }
    }

    function contactCheckMessage(allInput) {
      checkAll = [];
      allInput.forEach((inputElement) => {
        if (inputElement.value.trim() == "") {
          text = ["name", "email", "subject", "message"];
          let getIndex = allInput.indexOf(inputElement);
          contactErrorMessage(inputElement, `Please enter ${text[getIndex]}`);
          checkAll.push(false);
        } else if (inputElement.value.trim() !== "") {
          checkAll.push(true);
          successContactMessage(inputElement);
        }
        //  if any input have data
      });
      return checkAll.every((element) => element === true);
    }

    function successContactMessage(inputID) {
      let parentInput = inputID.parentElement;
      parentInput.classList.remove("error");
    }

    function contactErrorMessage(inputBx, errorMes) {
      const parentBx = inputBx.parentElement;
      parentBx.classList.add("error");
      let showErr = parentBx.querySelector(".error-message");
      showErr.innerText = errorMes;
    }

    // Check email
    function checkEmail(email) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  });
}



// Delete client contact message data

deleteContactBtn.forEach((delBtn) => {
  delBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const getContactID = delBtn.getAttribute("id");

    Swal.fire({
      title: "Confirm to delete this contact.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#000",
      confirmButtonText: "Delete",
      cancelButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        // send data to server
        fetch(`/admin/manageAdmin/deleteContact/contact-${getContactID}`, {
          method: "POST",
        })
          .then(res => res.json())
          .then(json => {
            Swal.fire({
              position: "center",
              icon: `${JSON.stringify(json.icon).slice(1, -1)}`,
              title: `${JSON.stringify(json.title).slice(1, -1)}`,
              showConfirmButton: false,
              timer: 1000,
            });
          });

          setTimeout(()=>{
            window.location.reload();
          },1000)
      }
    });
  });
});

// /admin/manageAdmin/deleteContact/contact-{{this.id}}
