import Vue from "vue";

import Card from "../../components/container/Card";
import Row from "../../components/container/Row";
import Col from "../../components/container/Col";
import Carousel from "../../components/container/Carousel";
// import CardItem from "../../components/container/CardItem";
import Panel from "../../components/container/Panel";
import Container from '../../components/container/Container';


Vue.component("wx-card", Card);
Vue.component("wx-row", Row);
Vue.component("wx-col", Col);
Vue.component("wx-carousel", Carousel);
// Vue.component("wx-carditem", CardItem);
Vue.component("wx-panel", Panel);
Vue.component("wx-container", Container);


import MaskDualRing from '../../components/loading/DualRing'
Vue.component("wx-mask-dualring", MaskDualRing);
