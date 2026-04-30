import { colors } from '../../theme/theme';

interface Props {
    size?: 'sm' | 'md' | 'lg';
    showTagline?: boolean;
}

export default function Logo({ size = 'md', showTagline = false }: Props) {
    const sizes = {
        sm: { icon: 32, text: 18 },
        md: { icon: 44, text: 26 },
        lg: { icon: 56, text: 32 },
    };
    const s = sizes[size];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
            }}
        >
            <div
                style={{
                    width: s.icon,
                    height: s.icon,
                    background: colors.orange,
                    borderRadius: s.icon * 0.28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <svg fill='none' height={s.icon * 0.55} viewBox='0 0 24 24' width={s.icon * 0.55}>
                    <title>logo</title>
                    <path
                        d='M12 3C8.5 3 6 6.2 6 9.8c0 4.8 6 11.7 6 11.7s6-6.9 6-11.7C18 6.2 15.5 3 12 3z'
                        fill='white'
                        opacity='0.95'
                    />
                    <circle cx='12' cy='9.8' fill={colors.orange} r='2.8' />
                </svg>
            </div>
            <div
                style={{
                    fontSize: s.text,
                    fontWeight: 900,
                    color: colors.white,
                    letterSpacing: '-1px',
                    lineHeight: 1,
                }}
            >
                Leva <span style={{ color: colors.orange }}>AÍ!</span>
            </div>
            {showTagline && (
                <div style={{ fontSize: 11, color: colors.gray3, fontWeight: 500 }}>
                    Você e suas compras em casa!
                </div>
            )}
        </div>
    );
}
