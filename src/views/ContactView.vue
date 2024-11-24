<template>
  <TopNav></TopNav>
  <div
    class="page__content page__content--with-header page__content--with-bottom-nav"
  >
    <h2 class="page__title">Get in touch</h2>
    <p class="welcome">Please fill out any inquiries or suggestions</p>
    <div class="fieldset">
      <h2 id="Note"></h2>
      <div class="form">
        <form class="" id="ContactForm" method="post" action="">
          <div class="form__row">
            <input
              v-model="form.user_name"
              type="text"
              name="user_name"
              value=""
              class="form__input required"
              placeholder="Name"
            />
          </div>
          <div class="form__row">
            <input
              v-model="form.user_email"
              type="text"
              name="ContactEmail"
              value=""
              class="form__input email required"
              placeholder="Email"
              readonly
            />
          </div>
          <div class="form__row p-3">
            <div class="form__select">
              <select
                name="ContactSelect"
                aria-label="suggestions"
                class="required"
                v-model="form.suggestions"
              >
                <option disabled selected>Check suggestions</option>
                <option value="Error">Error</option>
                <option value="Bug">Bug</option>
                <option value="Send">Send</option>
                <option value="Trading">Trading</option>
              </select>
            </div>
          </div>
          <div class="form__row">
            <textarea
              name="ContactComment"
              class="form__textarea required"
              placeholder="Type your question here"
              v-model="form.content"
            ></textarea>
          </div>

          <div class="form__row mt-20">
            <input
              type="submit"
              name="submit"
              class="form__submit button button--main button--full"
              id="submit"
              value="SUBMIT"
              @click.prevent="sendQuestion"
            />
            <input class="" type="hidden" name="to" value="youremail" />
            <input
              class=""
              type="hidden"
              name="ContactSubject"
              value="Contact form message"
            />
            <label id="loader" style="display: none">
              <div id="loader-animation">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </label>
          </div>
        </form>
      </div>
    </div>
    <h2 class="page__title">Location Map Example</h2>
    <div class="fieldset">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193578.74109041138!2d-73.97968099999997!3d40.70331274999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew+York+NYC%2C+New+York%2C+Statele+Unite+ale+Americii!5e0!3m2!1sro!2s!4v1425027721891"
        width="100%"
        height="200"
        frameborder="0"
        style="border: 0"
      ></iframe>
    </div>
    <h2 class="page__title">Contact Info</h2>
    <div class="fieldset">
      <ul class="custom-listing">
        <li class="address text-start">
          <span>Address:</span> New York 23066 / Pacific Street / Brooklyn
        </li>
        <li class="email text-start"><span>Email:</span> 당신의이메일</li>
        <li class="phone text-start"><span>Mobile:</span> +900 456 567 77</li>
      </ul>
    </div>
  </div>
  <BottomView></BottomView>
</template>

<script setup>
import TopNav from "@/components/templates/inc/TopNav.vue";

import BottomView from "@/components/templates/inc/BottomView.vue";
import { reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const user_srl = localStorage.getItem("user_srl");
const user_name = localStorage.getItem("user_name");
const user_email = localStorage.getItem("user_email");

const form = reactive({
  user_srl: user_srl,
  user_name: user_name,
  user_email: user_email,
  suggestions: "Check suggestions",
  content: "",
});
const router = useRouter();

const sendQuestion = async () => {
  const url = "http://1.231.89.30:3000/notice/sendQuestion ";
  const res = await axios.post(url, form);
  const response = res.data;
  if (response.result == "success") {
    router.push("/home");
  }
};
</script>

<style scoped>
.notice {
  background-color: #0c0d4662;
  /* border: 1px solid #333; */
  border-radius: 5px;
  padding: 10px;
}
a {
  color: rgb(224, 224, 224);
  text-decoration: none;
}
option {
  background-color: #0f0638;
}
</style>
