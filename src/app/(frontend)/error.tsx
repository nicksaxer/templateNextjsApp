'use client';

import Container from '@frontend/components/layout/Container';
import EmptyState from '@frontend/components/ui/elements/EmptyState';
import Button from '@frontend/components/ui/inputs/Button';

export default function ErrorPage({reset}: {error: Error & {digest?: string}; reset: () => void}) {
    return (
        <Container>
            <EmptyState
                title="A little bump in the road"
                icon="cloud-rain"
                action={
                    <Button filled onClick={reset}>
                        Give it another try
                    </Button>
                }
            >
                Something didn’t go to plan. Let’s try that again.
            </EmptyState>
        </Container>
    );
}
