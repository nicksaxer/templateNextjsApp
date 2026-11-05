'use client';

import Container from '@frontend/components/layout/Container';
import EmptyState from '@frontend/components/ui/elements/EmptyState';
import Button from '@frontend/components/ui/inputs/Button';

export default function ErrorPage({reset}: {error: Error & {digest?: string}; reset: () => void}) {
    return (
        <Container>
            <EmptyState
                title="Something went wrong"
                icon="cloud-rain"
                action={
                    <Button filled onClick={reset}>
                        Try again
                    </Button>
                }
            >
                Please try again.
            </EmptyState>
        </Container>
    );
}
