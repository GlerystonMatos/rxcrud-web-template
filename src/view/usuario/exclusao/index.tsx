import { useState } from 'react';
import { AxiosError } from 'axios';
import api from '../../../services/api';
import { useForm, SubmitHandler } from 'react-hook-form';
import { tratarErroApi } from '../../../rxlib/services/utilitarios';
import { Exclusao } from '../../../rxlib/componentes/layout/exclusao';
import { Redirecionar } from '../../../rxlib/componentes/redirecionar';
import { RxlibLayout } from '../../../rxlib/componentes/layout/rxlib-Layout';
import { ModalWarning } from '../../../rxlib/componentes/modal/modal-warning';
import { ModalPrimary } from '../../../rxlib/componentes/modal/modal-primary';
import { ApiError, ExclusaoProps, FormExclusao } from '../../../services/tipos';

import {
    Breadcrumb,
    BreadcrumbItem,
} from 'rxlib-react';

function UsuarioExclusao(props: ExclusaoProps) {
    const [excluido, setExcluido] = useState<boolean>(false);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [showPrimary, setShowPrimary] = useState<boolean>(false);
    const [messageWarning, setMessageWarning] = useState<string[]>([]);
    const [messagePrimary, setMessagePrimary] = useState<string[]>([]);

    const { handleSubmit } = useForm<FormExclusao>();

    const handleHideWarning = () => setShowWarning(false);

    const handleHidePrimary = () => {
        setShowPrimary(false);
        setExcluido(true);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { texto: 'Home', link: '/home' },
        { texto: 'Usuários', link: '/usuario' },
        { texto: 'Exclusão', link: '' },
    ];

    const onSubmit: SubmitHandler<FormExclusao> = data => {
        setCarregando(true);
        api.delete(`/Usuario/${props.match.params.id}`, data)
            .then(response => {
                setMessagePrimary(['Usuário excluído com sucesso.']);
                setShowPrimary(true);
            }).catch((error: AxiosError<ApiError>) => {
                setCarregando(false);
                setMessageWarning(tratarErroApi(error, 'Não foi possível excluir o usuário: '));
                setShowWarning(true);
            });
    }

    return (
        <>
            <RxlibLayout>
                <Breadcrumb
                    itens={breadcrumbs} />
                <Exclusao
                    linkCancelar='/usuario'
                    carregando={carregando}
                    onSubmit={handleSubmit(onSubmit)}
                    titulo='Deseja realmente excluir o usuário selecionado?' />
                <ModalWarning
                    show={showWarning}
                    message={messageWarning}
                    onHide={handleHideWarning} />
                <ModalPrimary
                    show={showPrimary}
                    message={messagePrimary}
                    onHide={handleHidePrimary} />
                <Redirecionar
                    se={excluido}
                    para='/usuario' />
            </RxlibLayout>
        </>
    )
}

export default UsuarioExclusao;