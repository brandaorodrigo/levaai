import type { SituacaoCorrida, TamanhoCompra } from './types';

// Máscara de telefone (XX) XXXXX-XXXX — usada como normalize nos formulários.
const telefone = (value: string): string => {
    const digits = String(value || '')
        .replace(/\D/g, '')
        .slice(0, 11);
    if (!digits.length) {
        return '';
    }
    if (digits.length <= 2) {
        return `(${digits}`;
    }
    if (digits.length <= 7) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

// Apenas dígitos (para enviar o telefone ao backend).
const somenteDigitos = (value: string): string => String(value || '').replace(/\D/g, '');

// Formata um valor monetário (o backend devolve NUMERIC como string).
const moeda = (value: string | number | null | undefined): string => {
    const numero = Number(value ?? 0);
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const rotuloTamanho: Record<TamanhoCompra, string> = {
    pequena: 'Pequena',
    media: 'Média',
    grande: 'Grande',
};

const rotuloSituacao: Record<SituacaoCorrida, string> = {
    cliente_solicitou: 'Procurando motorista',
    motorista_aceitou: 'Motorista a caminho',
    em_andamento: 'Compra a caminho',
    finalizada: 'Finalizada',
};

export { moeda, rotuloSituacao, rotuloTamanho, somenteDigitos, telefone };
