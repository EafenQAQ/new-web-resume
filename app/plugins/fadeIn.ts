import type { Directive, DirectiveBinding } from 'vue'

interface FadeInOptions {
  delay?: number
  duration?: number
  distance?: number
  immediate?: boolean
}

const observerMap = new WeakMap<Element, IntersectionObserver>()

const fadeIn: Directive<HTMLElement, FadeInOptions> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<FadeInOptions>) {
    const options = binding.value || {}
    const delay = options.delay || 0
    const duration = options.duration || 600
    const distance = options.distance || 30
    const immediate = options.immediate || false

    // 设置初始样式
    el.style.opacity = '0'
    el.style.transform = `translateY(${distance}px)`
    el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`
    el.style.transitionDelay = `${delay}ms`
    el.style.willChange = 'opacity, transform'

    // 添加初始类
    el.classList.add('fade-in-enter')

    // 触发动画函数
    const triggerAnimation = () => {
      el.classList.remove('fade-in-enter')
      el.classList.add('fade-in-visible')
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'

      // 动画完成后清理
      setTimeout(() => {
        el.style.transition = ''
        el.style.transitionDelay = ''
        el.style.willChange = ''
      }, duration + delay)
    }

    if (immediate) {
      // 立即触发动画，忽略 IntersectionObserver
      import('vue').then(({ nextTick }) => {
        nextTick(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              triggerAnimation()
            })
          })
        })
      })
      return
    }

    // 创建 Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 元素进入视口，触发动画
            el.classList.remove('fade-in-enter')
            el.classList.add('fade-in-visible')
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'

            // 动画完成后清理
            setTimeout(() => {
              el.style.transition = ''
              el.style.transitionDelay = ''
              el.style.willChange = ''
            }, duration + delay)

            // 停止观察
            observer.unobserve(el)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    )

    observer.observe(el)
    observerMap.set(el, observer)
  },

  unmounted(el: HTMLElement) {
    const observer = observerMap.get(el)
    if (observer) {
      observer.disconnect()
      observerMap.delete(el)
    }
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('fade-in', fadeIn)
})
