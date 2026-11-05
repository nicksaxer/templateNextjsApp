import Link from 'next/link';
import Container from '@frontend/components/layout/Container';
import InputsShowcase from '@frontend/components/modules/Showcase/InputsShowcase';
import FeedbackShowcase from '@frontend/components/modules/Showcase/FeedbackShowcase';
import MotionShowcase from '@frontend/components/modules/Showcase/MotionShowcase';
import Icon from '@frontend/components/ui/elements/Icon';
import styles from '@frontend/components/modules/Showcase/Showcase.module.css';

export default function Home() {
    return (
        <Container>
            <div className={styles.hero}>
                <div className={styles.heroText}>
                    <span className={styles.eyebrow}>A FEW GOOD THINGS TO BUILD ON</span>
                    <h1>
                        Start with
                        <br />
                        the good parts.
                    </h1>
                    <p>
                        Thoughtful essentials for your next idea.
                        <br />
                        Ready to try. Easy to make your own.
                    </p>
                    <a href="#inputs" className={styles.heroLink}>
                        Take a look around <Icon name="arrow-down" />
                    </a>
                </div>
                <div className={styles.art} aria-hidden="true">
                    <div className={styles.artGrid}>
                        <span>✳</span>
                        <span>◒</span>
                        <span>◓</span>
                        <span>◇</span>
                    </div>
                </div>
            </div>
            <div className={styles.intro}>
                <p>A small collection of everyday essentials, brought together in one place. Go ahead and click, type, open, close. This space is yours to explore.</p>
                <span>
                    <Icon name="check2-circle" /> All set to explore
                </span>
            </div>
            <InputsShowcase />
            <FeedbackShowcase />
            <MotionShowcase />
            <div className={styles.cta}>
                <div>
                    <h2>Let’s put it all together.</h2>
                    <p>Give your next project a name and see it take shape.</p>
                </div>
                <Link href="/project">
                    Start a little project <Icon name="arrow-right" />
                </Link>
            </div>
        </Container>
    );
}
