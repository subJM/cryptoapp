<template>
  <TopNav></TopNav>
  <div
    class="page__content page__content--with-header page__content--with-bottom-nav"
  >
    <div class="search__form">
      <form>
        <input
          type="text"
          class="search__input"
          id=""
          name=""
          value=""
          placeholder="Search Cryptocurrencies"
        />
        <input type="submit" class="search__submit" value="Send" />
      </form>
    </div>

    <h2 class="page__title">Cryptocurrencies</h2>

    <div class="cards cards--11">
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/BTC.png" alt="" title="" /><span
            >Bitcoin <b>BTC</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartup" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$41,827.71</strong><span class="plus">+10%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/ETH.png" alt="" title="" /><span
            >Ethereum <b>ETH</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartup" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$3,250.30</strong><span class="plus">+8%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/tether.png" alt="" title="" /><span
            >Tether <b>USDT</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartup" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$1,00</strong><span class="plus">+0.05%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/binance.png" alt="" title="" /><span
            >BNB<b>BNB</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartup" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$431,36</strong><span class="plus">+5%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/cardano.png" alt="" title="" /><span
            >Cardano <b>ADA</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartdown" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$1,19</strong><span class="minus">-1%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/elrond.png" alt="" title="" /><span
            >Elrond <b>EGLD</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartdown" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$320</strong><span class="minus">-5%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/sandbox.png" alt="" title="" /><span
            >The Sandbox <b>SAND</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartup" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$6,5</strong><span class="plus">+5%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/solana.png" alt="" title="" /><span
            >Solana <b>SOL</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartdown" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$140</strong><span class="minus">-4%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/polkadot.png" alt="" title="" /><span
            >Polkadot <b>DOT</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartdown" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$22,37</strong><span class="minus">-5%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/litecoin.png" alt="" title="" /><span
            >Litecoin <b>LTC</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartup" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$128,74</strong><span class="plus">+5%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/uniswap.png" alt="" title="" /><span
            >Uniswap <b>UNI</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartdown" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$12,37</strong><span class="minus">-5%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/shiba.png" alt="" title="" /><span
            >Shiba Inu <b>SHIB</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartup" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$0,000028</strong><span class="plus">+5%</span>
        </div>
      </a>
      <a class="card-coin" href="details.html">
        <div class="card-coin__logo">
          <img src="images/logos/crypto.png" alt="" title="" /><span
            >Crypto.com <b>CRO</b></span
          >
        </div>
        <div class="card-coin__chart">
          <canvas class="chartdown" width="50" height="30"></canvas>
        </div>
        <div class="card-coin__price">
          <strong>$0,37</strong><span class="minus">-2%</span>
        </div>
      </a>
    </div>
  </div>
  <BottomView></BottomView>
</template>

<script setup>
import TopNav from "@/components/templates/inc/TopNav.vue";

import BottomView from "@/components/templates/inc/BottomView.vue";
</script>

<style scoped>
.notice {
  background-color: #291f57;
  /* border: 1px solid #333; */
  border-radius: 10px;
  padding: 10px;
}
a {
  color: rgb(224, 224, 224);
  text-decoration: none;
}
</style>
