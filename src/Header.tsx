const Header = () => {
    return (
        <div
            style={{
                display: 'block',
                justifyContent: 'center',
                margin: '0 auto 30px auto',
            }}
        >
            <div
                style={{
                    width: 80,
                    height: 80,
                    background: 'var(--ant-color-primary)',
                    borderRadius: 100 * 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <svg fill='none' height={70} viewBox='0 0 24 24' width={70}>
                    <title>Levaai!</title>
                    <path
                        d='M12 3C8.5 3 6 6.2 6 9.8c0 4.8 6 11.7 6 11.7s6-6.9 6-11.7C18 6.2 15.5 3 12 3z'
                        fill='white'
                        opacity='0.95'
                    />
                    <circle cx='12' cy='9.8' fill='var(--ant-color-primary)' r='2.8' />
                </svg>
            </div>
            <div style={{ display: 'block' }}>
                <div
                    style={{
                        fontSize: 30,
                        fontWeight: 900,
                        color: 'var(--ant-color-text-base)',
                        letterSpacing: '-1px',
                        lineHeight: 1,
                        width: '100%',
                        display: 'block',
                    }}
                >
                    Leva <span style={{ color: 'var(--ant-color-primary)' }}>AÍ!</span>
                </div>
            </div>
            <div
                style={{
                    fontSize: 11,
                    color: 'var(--ant-color-text-secondary)',
                    fontWeight: 500,
                    display: 'block',
                }}
            >
                Você e suas compras em casa!
            </div>
        </div>
    );
};

export default Header;
