import { AxiosError } from 'axios';
import api from '../../../services/api';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Redirecionar from '../../../components/redirecionar';
import { ApiError, CadastroProps, Estado } from '../../../services/tipos';
import { RxlibLayout } from '../../../rxlib/componentes/layout/rxlib-Layout';
import { ModalPrimary } from '../../../rxlib/componentes/modal/modal-primary';
import { ModalWarning } from '../../../rxlib/componentes/modal/modal-warning';
import { criptografar, descriptografar, tratarErroApi } from '../../../rxlib/services/utilitarios';

import {
    Breadcrumb,
    InputLabel,
    ButtonsCrud,
    BreadcrumbItem,
} from 'rxlib-react';

function EstadoCadastro(props: CadastroProps) {
    const [salvo, setSalvo] = useState<boolean>(false);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [showPrimary, setShowPrimary] = useState<boolean>(false);
    const [messageWarning, setMessageWarning] = useState<string[]>([]);
    const [messagePrimary, setMessagePrimary] = useState<string[]>([]);

    const [estado, setEstado] = useState<Estado>({
        id: '',
        uf: '',
        descricao: '',
    });

    const { register, handleSubmit } = useForm<Estado>();

    const handleHideWarning = () => setShowWarning(false);

    const handleHidePrimary = () => {
        setShowPrimary(false);
        setSalvo(true);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { texto: 'Home', link: '/home' },
        { texto: 'Estados', link: '/estado' },
        { texto: props.match.params.action ? 'Visualização' : props.match.params.id ? 'Edição' : 'Novo', link: '' },
    ];

    useEffect(() => {
        if (props.match.params.id) {
            api.get(`/Estado/${props.match.params.id}`)
                .then(response => {
                    setEstado({
                        id: response.data.id,
                        uf: response.data.uf,
                        descricao: response.data.descricao,
                    });
                }).catch((error: AxiosError<ApiError>) => {
                    tratarErro(error);
                });
        }
    }, [props.match.params.id]);

    const onSubmit: SubmitHandler<Estado> = data => {
        setCarregando(true);
        data.uf = criptografar(data.uf);
        props.match.params.id
            ? editar(data)
            : salvar(data);
    }

    function salvar(data: Estado) {
        api.post('/Estado', data)
            .then(response => {
                informarSucesso();
            }).catch((error: AxiosError<ApiError>) => {
                tratarErro(error);
            });
    }

    function editar(data: Estado) {
        api.put('/Estado', data)
            .then(response => {
                informarSucesso();
            }).catch((error: AxiosError<ApiError>) => {
                tratarErro(error);
            });
    }

    function informarSucesso() {
        setMessagePrimary(['Estado salvo com sucesso.']);
        setShowPrimary(true);
    }

    function tratarErro(error: AxiosError<ApiError>) {
        setCarregando(false);
        setMessageWarning(tratarErroApi(error, 'Não foi possível salvar o estado: '));
        setShowWarning(true);
    }

    return (
        <>
            <RxlibLayout>
                <Breadcrumb
                    itens={breadcrumbs} />
                <form onSubmit={handleSubmit(onSubmit)} className='rxlib-form'>
                    <div className='container-fluid'>
                        <div className='row px-1'>
                            <div className='col-12'>
                                <h6>{props.match.params.action ? 'Visualizar' : props.match.params.id ? 'Editar' : 'Novo'} estado</h6>
                            </div>
                        </div>
                        {
                            props.match.params.id
                                ? <div className='row px-1'>
                                    <div className='col-12 mt-1'>
                                        <InputLabel
                                            name='id'
                                            type='text'
                                            id='inputId'
                                            maxLength={50}
                                            label='Código:'
                                            readOnly={true}
                                            autoFocus={false}
                                            defaultValue={estado.id}
                                            placeholder='Código do estado'
                                            referencia={register({ required: true })} />
                                    </div>
                                </div>
                                : ''
                        }
                        <div className='row px-1'>
                            <div className='col-12 mt-1'>
                                <InputLabel
                                    name='uf'
                                    type='text'
                                    label='UF:'
                                    id='inputNome'
                                    maxLength={50}
                                    autoFocus={true}
                                    defaultValue={estado.uf}
                                    placeholder='Nome do estado'
                                    referencia={register({ required: true })}
                                    readOnly={props.match.params.action === 'view'} />
                            </div>
                        </div>
                        <div className='row px-1'>
                            <div className='col-12 mt-1'>
                                <InputLabel
                                    name='descricao'
                                    type='text'
                                    id='inputEmail'
                                    label='Descrição:'
                                    maxLength={100}
                                    autoFocus={false}
                                    defaultValue={estado.uf}
                                    placeholder='Descrição do Estado'
                                    referencia={register({ required: true })}
                                    readOnly={props.match.params.action === 'view'} />
                            </div>
                        </div>
                        <ButtonsCrud
                            styleButton='btn-rxlib'
                            carregando={carregando}
                            linkCancelarVoltar='/estado'
                            visualizar={props.match.params.action === 'view'} />
                    </div>
                </form>
                <ModalWarning
                    show={showWarning}
                    message={messageWarning}
                    onHide={handleHideWarning} />
                <ModalPrimary
                    show={showPrimary}
                    message={messagePrimary}
                    onHide={handleHidePrimary} />
                <Redirecionar
                    se={salvo}
                    para='/estado' />
            </RxlibLayout>
        </>
    );
}

export default EstadoCadastro;