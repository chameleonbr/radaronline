import type { ComponentProps, ReactNode } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NewsFeed } from './NewsFeed';

const mockLoadAnnouncements = vi.fn();
const mockLoadAutomatedEvents = vi.fn();
const mockLoadMuralConfig = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    a: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
    article: ({ children, ...props }: ComponentProps<'article'>) => <article {...props}>{children}</article>,
    button: ({ children, ...props }: ComponentProps<'button'>) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: ComponentProps<'div'>) => <div {...props}>{children}</div>,
    img: (props: ComponentProps<'img'>) => <img {...props} />,
  },
}));

vi.mock('../../ui/Button', () => ({
  Button: ({ children, ...props }: ComponentProps<'button'>) => <button {...props}>{children}</button>,
}));

vi.mock('../../services/announcementsService', () => ({
  loadAnnouncements: (...args: unknown[]) => mockLoadAnnouncements(...args),
}));

vi.mock('../../services/automatedEventsService', () => ({
  loadAutomatedEvents: (...args: unknown[]) => mockLoadAutomatedEvents(...args),
}));

vi.mock('../../services/muralConfigService', () => ({
  loadMuralConfig: (...args: unknown[]) => mockLoadMuralConfig(...args),
}));

vi.mock('../../auth/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('NewsFeed', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockLoadAnnouncements.mockResolvedValue([]);
    mockLoadAutomatedEvents.mockResolvedValue([]);
    mockLoadMuralConfig.mockResolvedValue({});
    mockUseAuth.mockReturnValue({
      user: {
        id: 'demo-visitor-001',
        microregiaoId: 'MR070',
      },
      viewingMicroregiaoId: null,
      isDemoMode: false,
    });
  });

  it('mostra o curso de saude digital no mural quando o visitante abre o modo teste', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'demo-visitor-001',
        microregiaoId: 'MR070',
      },
      viewingMicroregiaoId: null,
      isDemoMode: true,
    });

    render(<NewsFeed />);

    const highlightLink = await screen.findByRole('link', { name: /Acessar AVA/i });

    expect(highlightLink).toHaveAttribute('href', 'https://ava.saude.mg.gov.br/course/index.php?categoryid=31');
    expect(screen.getByText(/Acessar AVA/i)).toBeInTheDocument();
  });

  it('nao injeta o destaque do curso fora do modo visitante', async () => {
    render(<NewsFeed />);

    await waitFor(() => {
      expect(mockLoadAnnouncements).toHaveBeenCalled();
    });

    expect(screen.queryByRole('link', { name: /Acessar AVA/i })).not.toBeInTheDocument();
  });
});
