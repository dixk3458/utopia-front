import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface LandingAnimationOptions {
  hero?: boolean;
}

export default function useLandingAnimations(
  scope: RefObject<HTMLElement | null>,
  options: LandingAnimationOptions = {},
) {
  useGSAP(
    () => {
      const q = gsap.utils.selector(scope);

      // Hero 초기 진입
      if (options.hero) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from(q('.hero-badge'), {
          y: 16,
          opacity: 0,
          duration: 0.5,
        })
          .from(
            q('.hero-title'),
            {
              y: 40,
              opacity: 0,
              duration: 0.8,
            },
            '-=0.2',
          )
          .from(
            q('.hero-desc'),
            {
              y: 24,
              opacity: 0,
              duration: 0.6,
            },
            '-=0.45',
          )
          .from(
            q('.hero-info'),
            {
              y: 20,
              opacity: 0,
              duration: 0.55,
            },
            '-=0.3',
          )
          .fromTo(
            q('.hero-actions > *'),
            {
              y: 18,
              autoAlpha: 0,
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.12,
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.2',
          )

          .from(
            q('.hero-stats > *'),
            {
              y: 18,
              opacity: 0,
              duration: 0.45,
              stagger: 0.1,
            },
            '-=0.15',
          )
          .from(
            q('.hero-visual'),
            {
              x: 40,
              opacity: 0,
              scale: 0.96,
              duration: 0.9,
            },
            '-=0.9',
          );

        gsap.to(q('.hero-glow'), {
          y: -20,
          scale: 1.05,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        gsap.to(q('.hero-image'), {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 섹션 공통 헤더
      gsap.utils.toArray<HTMLElement>(q('.section-header')).forEach((el) => {
        gsap.from(el.children, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
        });
      });

      // 카드 그리드
      gsap.utils.toArray<HTMLElement>(q('.stagger-grid')).forEach((grid) => {
        const items = Array.from(grid.children);

        gsap.set(items, {
          y: 24,
          autoAlpha: 0,
        });

        gsap.to(items, {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'opacity,visibility,transform',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true,
            invalidateOnRefresh: true,
          },
        });
      });

      // 타임라인 아이템
      gsap.utils.toArray<HTMLElement>(q('.timeline-group')).forEach((group) => {
        const line = group.querySelector('.timeline-line');
        const items = group.querySelectorAll('.timeline-item');

        if (line) {
          gsap.fromTo(
            line,
            {
              scaleY: 0,
              transformOrigin: 'top center',
              autoAlpha: 0.5,
            },
            {
              scaleY: 1,
              autoAlpha: 1,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 82%',
                once: true,
              },
            },
          );
        }

        gsap.fromTo(
          items,
          {
            x: -20,
            y: 12,
            autoAlpha: 0,
          },
          {
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.16,
            ease: 'power3.out',
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: group,
              start: 'top 80%',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      // 이미지 reveal
      gsap.utils.toArray<HTMLElement>(q('.reveal-image')).forEach((image) => {
        gsap.from(image, {
          y: 36,
          opacity: 0,
          scale: 0.96,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: image,
            start: 'top 85%',
            once: true,
          },
        });
      });

      // 카드 hover 미세 인터랙션
      gsap.utils.toArray<HTMLElement>(q('.hover-lift')).forEach((card) => {
        const onEnter = () =>
          gsap.to(card, {
            y: -8,
            duration: 0.25,
            ease: 'power2.out',
          });

        const onLeave = () =>
          gsap.to(card, {
            y: 0,
            duration: 0.25,
            ease: 'power2.out',
          });

        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);

        return () => {
          card.removeEventListener('mouseenter', onEnter);
          card.removeEventListener('mouseleave', onLeave);
        };
      });
    },
    { scope },
  );
}
