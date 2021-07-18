<script>
import observeDom from "bootstrap-vue/src/utils/observe-dom";
import KeyCodes from "bootstrap-vue/src/utils/key-codes";
import {
  selectAll,
  reflow,
  addClass,
  removeClass,
  setAttr,
  eventOn,
  eventOff
} from "bootstrap-vue/src/utils/dom";
import idMixin from "bootstrap-vue/src/mixins/id";
import Core from "../../core";

// Slide directional classes
const DIRECTION = {
  next: {
    dirClass: "carousel-item-left",
    overlayClass: "carousel-item-next"
  },
  prev: {
    dirClass: "carousel-item-right",
    overlayClass: "carousel-item-prev"
  }
};

// Fallback Transition duration (with a little buffer) in ms
const TRANS_DURATION = 1000 + 50;

// Transition Event names
const TransitionEndEvents = {
  WebkitTransition: "webkitTransitionEnd",
  MozTransition: "transitionend",
  OTransition: "otransitionend oTransitionEnd",
  transition: "transitionend"
};

// Return the browser specific transitionEnd event name
function getTransisionEndEvent(el) {
  for (const name in TransitionEndEvents) {
    if (el.style[name] !== undefined) {
      return TransitionEndEvents[name];
    }
  }
  // fallback
  return null;
}

export default {
  mixins: [idMixin],
  render(h) {
    // Wrapper for slides
    const inner = h(
      "div",
      {
        ref: "inner",
        class: [
          "carousel-inner",
          this.forceDisplay ? "carousel-inner-force-dsp" : ""
        ],
        attrs: {
          id: this.safeId("__BV_inner_"),
          role: "list"
        }
      },
      [this.$slots.default]
    );

    // Prev and Next Controls
    let controls = h(false);
    if (this.controls) {
      controls = [
        h(
          "a",
          {
            class: ["carousel-control-prev"],
            attrs: {
              href: "#",
              role: "button",
              "aria-controls": this.safeId("__BV_inner_")
            },
            on: {
              click: evt => {
                evt.preventDefault();
                evt.stopPropagation();
                this.prev();
              },
              keydown: evt => {
                const keyCode = evt.keyCode;
                if (keyCode === KeyCodes.SPACE || keyCode === KeyCodes.ENTER) {
                  evt.preventDefault();
                  evt.stopPropagation();
                  this.prev();
                }
              }
            }
          },
          [
            h("span", {
              class: ["carousel-control-prev-icon"],
              attrs: { "aria-hidden": "true" }
            }),
            h("span", { class: ["sr-only"] }, [this.labelPrev])
          ]
        ),
        h(
          "a",
          {
            class: ["carousel-control-next"],
            attrs: {
              href: "#",
              role: "button",
              "aria-controls": this.safeId("__BV_inner_")
            },
            on: {
              click: evt => {
                evt.preventDefault();
                evt.stopPropagation();
                this.next();
              },
              keydown: evt => {
                const keyCode = evt.keyCode;
                if (keyCode === KeyCodes.SPACE || keyCode === KeyCodes.ENTER) {
                  evt.preventDefault();
                  evt.stopPropagation();
                  this.next();
                }
              }
            }
          },
          [
            h("span", {
              class: ["carousel-control-next-icon"],
              attrs: { "aria-hidden": "true" }
            }),
            h("span", { class: ["sr-only"] }, [this.labelNext])
          ]
        )
      ];
    }

    // Indicators
    const indicators = h(
      "ol",
      {
        class: ["carousel-indicators"],
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: this.indicators,
            expression: "indicators"
          }
        ],
        attrs: {
          id: this.safeId("__BV_indicators_"),
          "aria-hidden": this.indicators ? "false" : "true",
          "aria-label": this.labelIndicators,
          "aria-owns": this.safeId("__BV_inner_")
        }
      },
      this.slides.map((slide, n) => {
        return h("li", {
          key: `slide_${n}`,
          class: { active: n === this.index },
          attrs: {
            role: "button",
            id: this.safeId(`__BV_indicator_${n + 1}_`),
            tabindex: this.indicators ? "0" : "-1",
            "aria-current": n === this.index ? "true" : "false",
            "aria-label": `${this.labelGotoSlide} ${n + 1}`,
            "aria-describedby": this.slides[n].id || null,
            "aria-controls": this.safeId("__BV_inner_")
          },
          on: {
            click: evt => {
              this.setSlide(n);
            },
            keydown: evt => {
              const keyCode = evt.keyCode;
              if (keyCode === KeyCodes.SPACE || keyCode === KeyCodes.ENTER) {
                evt.preventDefault();
                evt.stopPropagation();
                this.setSlide(n);
              }
            }
          }
        });
      })
    );

    let mask = h("wx-mask-dualring", {
      props: {
        mask: this.mask
      }
    });
    // Return the carousel
    return h(
      "div",

      {
        class: [
          "carousel",
          "slide",
          this.forceDisplay ? "carousel-force-dsp" : ""
        ],
        style: { background: this.background },
        attrs: {
          role: "region",
          id: this.safeId(),
          "aria-busy": this.isSliding ? "true" : "false"
        },
        on: {
          mouseenter: this.pause,
          mouseleave: this.restart,
          focusin: this.pause,
          focusout: this.restart,
          keydown: evt => {
            // console.log(evt)
            window.e = evt;
            const keyCode = evt.keyCode;
            if (keyCode === KeyCodes.LEFT || keyCode === KeyCodes.RIGHT) {
              // evt.preventDefault();
              // evt.stopPropagation();
              // this[keyCode === KeyCodes.LEFT ? "prev" : "next"]();
            }
          }
        }
      },
      [inner, controls, indicators, mask]
    );
  },
  data() {
    return {
      index: this.value || 0,
      isSliding: false,
      intervalId: null,
      transitionEndEvent: null,
      slides: [],
      direction: null
    };
  },
  props: {
    labelPrev: {
      type: String,
      default: "Previous Slide"
    },
    labelNext: {
      type: String,
      default: "Next Slide"
    },
    labelGotoSlide: {
      type: String,
      default: "Goto Slide"
    },
    labelIndicators: {
      type: String,
      default: "Select a slide to display"
    },
    interval: {
      type: Number,
      default: 0
    },
    indicators: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: false
    },
    imgWidth: {
      // Sniffed by carousel-slide
      type: [Number, String]
    },
    imgHeight: {
      // Sniffed by carousel-slide
      type: [Number, String]
    },
    background: {
      type: String
    },
    value: {
      type: Number,
      default: 0
    },
    mask: {
      type: String,
      default: null
    },
    forceDisplay: {
      type: Boolean,
      default: false
    },
    preventScheduleAnimation: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isCycling() {
      return Boolean(this.intervalId);
    }
  },
  methods: {
    itemNameEqualByIndex(index, name) {
      let i = this.$children[index];
      // console.log(i);
      if (i && !Core.isElement(i)) {
        if (i.$options.name === name) {
          //no esta respetando el standard
          console.warn(
            "revisa el componente por que mas adelante dejara de ser compatible"
          );
          return true;
        } else if (i.name === name) {
          return true;
        } else if (i.itemRef === name) {
          return true;
        } else {
          return false;
        }
        // return i.$options.name || i.itemRef;
      } else {
        return false;
      }
    },
    getActiveItem() {
      this.slides = Array.prototype.slice.call(
        this.$refs.inner.querySelectorAll(":scope > .carousel-item")
      );
      let activeItem = this.slides[this.index];
      let i;
      for (let x = 0; x < this.$children.length; x++) {
        i = this.$children[x];
        if (i.$el === activeItem) {
          activeItem = i;
          break;
        }
      }
      return activeItem;
    },
    setActiveItem(element) {
      // debugger
      if (typeof element === "string") {
        let newActive, i;
        for (let x = 0; x < this.$children.length; x++) {
          i = this.$children[x];
          // console.log(i)
          if (!Core.isElement(i)) {
            if (i.$options.name === element) {
              newActive = i;
              break;
            } else if (i.itemRef === element) {
              newActive = i;
              break;
            } else if (i.name === element) {
              newActive = i;
              break;
            }
          }
        }
        // console.log(newActive);
        if (newActive !== null && newActive !== undefined) {
          let index = this.slides.indexOf(i.$el);
          this.direction = "next";
          setTimeout(() => {
            this.setSlide(index);
          }, 200);
        }
      } else if (typeof element === "number") {
        this.direction = "next";
        setTimeout(() => {
          this.setSlide(element);
        }, 200);
      }
    },
    // Set slide
    setSlide(slide) {
      // Don't animate when page is not visible
      if (
        typeof document !== "undefined" &&
        document.visibilityState &&
        document.hidden
      ) {
        return;
      }
      const len = this.slides.length;
      // Don't do anything if nothing to slide to
      if (len === 0) {
        return;
      }
      // Don't change slide while transitioning, wait until transition is done
      if (this.isSliding) {
        if(this.preventScheduleAnimation){
          console.log("prevent schedule animation");
          return;
        }
        // Schedule slide after sliding complete
        this.$once("sliding-end", () => this.setSlide(slide));
        return;
      }
      // Make sure we have an integer (you never know!)
      slide = Math.floor(slide);
      // Set new slide index. Wrap around if necessary
      this.index = slide >= len ? 0 : slide >= 0 ? slide : len - 1;
    },
    // Previous slide
    prev() {
      this.direction = "prev";
      this.setSlide(this.index - 1);
    },
    // Next slide
    next() {
      this.direction = "next";
      this.setSlide(this.index + 1);
    },
    // Pause auto rotation
    pause() {
      if (this.isCycling) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        if (this.slides[this.index]) {
          // Make current slide focusable for screen readers
          this.slides[this.index].tabIndex = 0;
        }
      }
    },
    // Start auto rotate slides
    start() {
      // Don't start if no interval, or if we are already running
      if (!this.interval || this.isCycling) {
        return;
      }
      this.slides.forEach(slide => {
        slide.tabIndex = -1;
      });
      this.intervalId = setInterval(() => {
        this.next();
      }, Math.max(1000, this.interval));
    },
    // Re-Start auto rotate slides when focus/hover leaves the carousel
    restart(evt) {
      if (!this.$el.contains(document.activeElement)) {
        this.start();
      }
    },
    // Update slide list
    updateSlides() {
      this.pause();
      // Get all slides as DOM elements
      this.slides = Array.prototype.slice.call(
        this.$refs.inner.querySelectorAll(":scope > .carousel-item")
      );

      // console.log(this.slides)
      const numSlides = this.slides.length;
      // Keep slide number in range
      const index = Math.max(
        0,
        Math.min(Math.floor(this.index), numSlides - 1)
      );
      this.slides.forEach((slide, idx) => {
        const n = idx + 1;
        if (idx === index) {
          addClass(slide, "active");
        } else {
          removeClass(slide, "active");
        }
        setAttr(slide, "aria-current", idx === index ? "true" : "false");
        setAttr(slide, "aria-posinset", String(n));
        setAttr(slide, "aria-setsize", String(numSlides));
        slide.tabIndex = -1;

        if (this.forceDisplay) {
          Core.apply(slide.style, {
            flex: `0 0 ${this.$el.clientWidth}px`,
            "-webkit-flex": `0 0 ${this.$el.clientWidth}px`
          });
        }
      });

      if (this.forceDisplay) {
        let inner = this.$refs["inner"];

        Core.apply(inner.style, {
          width: `${this.$el.clientWidth * (numSlides + 1)}px`
        });
      }
      // Set slide as active
      this.setSlide(index);
      this.start();
    },
    calcDirection(direction = null, curIndex = 0, nextIndex = 0) {
      if (!direction) {
        return nextIndex > curIndex ? DIRECTION.next : DIRECTION.prev;
      }
      return DIRECTION[direction];
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setSlide(newVal);
      }
    },
    interval(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }
      if (!newVal) {
        // Pausing slide show
        this.pause();
      } else {
        // Restarting or Changing interval
        this.pause();
        this.start();
      }
    },
    index(val, oldVal) {
      if (val === oldVal || this.isSliding) {
        return;
      }
      // Determine sliding direction
      let direction = this.calcDirection(this.direction, oldVal, val);
      // Determine current and next slides
      const currentSlide = this.slides[oldVal];
      const nextSlide = this.slides[val];
      // Don't do anything if there aren't any slides to slide to
      if (!currentSlide || !nextSlide) {
        return;
      }
      // Start animating
      this.isSliding = true;
      let called = false;
      this.$emit("sliding-start", val);
      // Update v-model
      this.$emit("input", this.index);
      if (this.forceDisplay) {
        let inner = this.$refs["inner"];
        this.slides = Array.prototype.slice.call(
          this.$refs.inner.querySelectorAll(":scope > .carousel-item")
        );
        // console.log(this.slides);
        let numSlides = this.slides.length;

        if (this.index > 0) {
          Core.apply(inner.style, {
            webkitTransform: `translate3d(-${this.$el.clientWidth *
              this.index}px,0,0)`,
            webkitTransition:
              "transform 1200ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s",
            "-webkit-transition":
              "-webkit-transform 1200ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s"
          });
        } else {
          Core.apply(nextSlide.style, {
            webkitTransform: `translateX(${this.$el.clientWidth *
              numSlides}px)`,
            webkitTransition:
              "transform 0ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s",
            "-webkit-transition":
              "-webkit-transform 0ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s"
          });

          Core.apply(inner.style, {
            // webkitTransform: "translate3d(-3840px,0,0)",
            webkitTransform: `translate3d(-${this.$el.clientWidth *
              numSlides}px,0,0)`,
            webkitTransition:
              "transform 1200ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s",
            "-webkit-transition":
              "-webkit-transform 1200ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s"
          });
        }

        const onceTransEnd = evt => {
          if (called) {
            return;
          }
          called = true;
          if (this.index === 0) {
            Core.apply(nextSlide.style, {
              webkitTransform: "translateX(0px)",
              webkitTransition:
                "transform 0ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s",
              "-webkit-transition":
                "-webkit-transform 0ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s"
            });
            Core.apply(inner.style, {
              webkitTransform: "translate3d(0px,0,0)",
              webkitTransition:
                "transform 0ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s",
              "-webkit-transition":
                "-webkit-transform 0ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s"
            });
          }
          this._animationTimeout = null;
          addClass(nextSlide, "active");
          removeClass(currentSlide, "active");
          this.isSliding = false;
          this.direction = null;
          this.$nextTick(() => this.$emit("sliding-end", val));
          this.$nextTick(() =>
            this.$emit("changeactiveitem", this, this.getActiveItem())
          );
        };
        if (this.transitionEndEvent) {
          const events = this.transitionEndEvent.split(/\s+/);
          events.forEach(event => {
            eventOn(inner, event, onceTransEnd);
          });
        }
        this._animationTimeout = setTimeout(onceTransEnd, TRANS_DURATION);
      } else {
        nextSlide.classList.add(direction.overlayClass);
        // Trigger a reflow of next slide
        reflow(nextSlide);
        addClass(currentSlide, direction.dirClass);
        addClass(nextSlide, direction.dirClass);
        // Transition End handler

        /* istanbul ignore next: dificult to test */
        const onceTransEnd = evt => {
          if (called) {
            return;
          }
          called = true;
          if (this.transitionEndEvent) {
            const events = this.transitionEndEvent.split(/\s+/);
            events.forEach(event => {
              eventOff(currentSlide, event, onceTransEnd);
            });
          }
          this._animationTimeout = null;
          removeClass(nextSlide, direction.dirClass);
          removeClass(nextSlide, direction.overlayClass);
          addClass(nextSlide, "active");
          removeClass(currentSlide, "active");
          removeClass(currentSlide, direction.dirClass);
          removeClass(currentSlide, direction.overlayClass);
          setAttr(currentSlide, "aria-current", "false");
          setAttr(nextSlide, "aria-current", "true");
          setAttr(currentSlide, "aria-hidden", "true");
          setAttr(nextSlide, "aria-hidden", "false");
          currentSlide.tabIndex = -1;
          nextSlide.tabIndex = -1;
          if (!this.isCycling) {
            // Focus the next slide for screen readers if not in play mode
            nextSlide.tabIndex = 0;
            this.$nextTick(() => {
              nextSlide.focus();
            });
          }
          this.isSliding = false;
          this.direction = null;
          // Notify ourselves that we're done sliding (slid)
          this.$nextTick(() => this.$emit("sliding-end", val));
          this.$nextTick(() =>
            this.$emit("changeactiveitem", this, this.getActiveItem())
          );
        };
        // Clear transition classes after transition ends
        if (this.transitionEndEvent) {
          const events = this.transitionEndEvent.split(/\s+/);
          events.forEach(event => {
            eventOn(currentSlide, event, onceTransEnd);
          });
        }
        // Fallback to setTimeout
        this._animationTimeout = setTimeout(onceTransEnd, TRANS_DURATION);
      }
    }
  },
  created() {
    // Create private non-reactive props
    this._animationTimeout = null;
  },
  mounted() {
    // Cache current browser transitionend event name
    this.transitionEndEvent = getTransisionEndEvent(this.$el) || null;
    // Get all slides
    this.updateSlides();
    // Observe child changes so we can update slide list
    observeDom(this.$refs.inner, this.updateSlides.bind(this), {
      subtree: false,
      childList: true,
      attributes: true,
      attributeFilter: ["id"]
    });
  },
  /* istanbul ignore next: dificult to test */
  beforeDestroy() {
    clearInterval(this.intervalId);
    clearTimeout(this._animationTimeout);
    this.intervalId = null;
    this._animationTimeout = null;
  }
};
</script>
<style lang="scss" scoped>
/*************FIXED STYLES****************/

.carousel-item.active,
.carousel-item-next,
.carousel-item-prev {
  display: block;
  transition: -webkit-transform 0.6s ease;
}

.carousel-item {
  align-items: center;
  -webkit-align-items: center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.carousel-item-prev,
.active.carousel-item-left {
  transform: translateX(-100%);
  -webkit-transform: translateX(-100%);
}

.carousel-item-next.carousel-item-left,
.carousel-item-prev.carousel-item-right {
  transform: translateX(0);
  -webkit-transform: translateX(0);
}

.carousel-item-next,
.active.carousel-item-right {
  transform: translateX(100%);
  -webkit-transform: translateX(100%);
}

/*****************************/

.carousel {
  width: 100%;
  height: 100%;
}
.carousel-inner {
  width: 100%;
  height: 100%;
}

.carousel-force-dsp {
  overflow: hidden;
}

.carousel-inner-force-dsp {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  -webkit-align-items: center;
  overflow-x: auto;
  display: -webkit-flex;
}

.carousel-inner-force-dsp > .carousel-item {
  position: relative;
  display: block;
  align-items: center;
  backface-visibility: hidden;
  -webkit-align-items: center;
  -webkit-backface-visibility: hidden;
  perspective: 1000px;
}
</style>
