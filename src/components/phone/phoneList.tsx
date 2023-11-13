import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Contact, getContact} from '../../modules/store/getContact';
import { flexCenter, fullFlexCenter } from '../../style/flex';
import { isExpand } from '../../style/width';
import { mq } from '../Composables/mediaQuery';
import trash from '@/icons/trash.svg';
import pencil from '@/icons/pencil.svg';
import phone from '@/icons/phone.svg';
import heart from '@/icons/heart.svg';
import { useEditContact } from '../../modules/store/editContact';
import { useDeleteContact } from '../../modules/store/deleteContacts';
import { favFix, getFirstNonSpaceCharacter, isFavorite } from '../../modules/function/functionFav';

//props
export interface PhoneListProps {
    item: Contact
    index: number
    preItem: Contact
    randomColor: string
    onMutationCompleted: (data: boolean) => void
    onDeleteContact: (data: boolean) => void
    onEditContact: (data: Contact, modal: string) => void
}

//function
const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

//styled
const PhoneStyle = styled.div({   
    display: 'flex',
    overflow: 'hidden',
    minWidth: '600px',
    maxWidth: '600px',    
    marginBottom: '10px',   
    transition: 'all 0.25s ease-out',
    [mq[2]]: {
        minWidth: '550px',
        maxWidth: '550px',
    },
    [mq[1]]: {
        minWidth: '350px',
        maxWidth: '350px',
    },
    [mq[0]]: {
        minWidth: '250px',
        maxWidth: '250px',
    },      
})

const swing = keyframes`
  0% {
    opacity: 1;   
  }
  100% {        
    opacity: 0;     
    width: 0px;
  }
`;

const ContactStyle = styled.div({    
    overflow: 'hidden',
    backgroundColor: 'var(--white)',    
    borderRadius: '5px',    
    height: '80px',     
    transition: 'all 0.25s ease',    
    '&:hover div:first-of-type': {
        transform: 'translateX(-400%)',
        marginLeft: '-24px',
        animation: `${swing} 0.25s forwards`,
    },  
    '&:hover div:nth-of-type(2)': {
        transform: 'translateX(-400%)',
        minWidth: '0%',
        marginLeft: '-24px',
        animation: `${swing} 0.25s forwards`,
    },
    '&:hover button': {
        transform: 'translateX(0%)',
    },
})


const ButtonStyle = styled.button(props => (
{    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `var(--${props.color}-btn)`,
    color: `var(--${props.color}-text)`,
    minHeight: '100%',
    width: '100%',
    border: 'none',
    borderRadius: `${props.lang}`,
    top: '10px',
    right: '10px',
    cursor: 'pointer',   
    transition: 'all 0.25s ease',   
    transform: 'translateX(400%)', 
    '&:hover': {
        opacity: '0.8',     
        img: {           
            minWidth: '30px',
            maxWidth: '30px',
            maxHeight: '30px',
            minHeight: '30px',
        }   
    },
    img: {
        transition: 'all 0.25s ease',   
        minWidth: '25px',
        maxWidth: '25px',
        maxHeight: '25px',
        minHeight: '25px',
    }
}));

const NameContactStyle = styled.div({
    minWidth: '100%',
    color: 'var(--secondary)',
    fontWeight: 700,
    marginLeft: '10px',
    transition: 'all 0.25s ease-out',
    boxSizing: 'border-box',
    [mq[2]]: {
        minWidth: '60%',
    },
})

const RoundedContactStyle = styled.div({
    marginLeft: '10px',
    borderRadius: '100%',
    padding: '10px',
    color: 'white',
    fontWeight: 500,
    minWidth: '25px',
    maxWidth: '25px',
    maxHeight: '25px',
    minHeight: '25px',
    transition: 'all 0.25s ease-out',   
}, props => ({ backgroundColor: props.color }))


const FontHeaderStyle = styled.div(props => ({
    color: `var(--${props.color})`,    
    width: '10px',
    marginRight: '10px',
    marginLeft: `${props.lang}px`,
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 15px',
    fontWeight: 600,
    fontSize: '12px',
    backgroundColor: `var(--${props.theme})`,
}))



//css
const phoneRow = {
    row: css({
        padding: '10px 5px',       
    }),
    number: css({
        marginTop: '5px',
        color: 'var(--disabled)',
        fontWeight: 400,
        fontSize: '12px',       
    }),
}

const openWhatsAppLink = (phoneNumber: string) => {
    window.location.href = `https://wa.me/${phoneNumber}`;
};



//Component
const PhoneList = ({ item, index, preItem, randomColor, onMutationCompleted, onDeleteContact, onEditContact }: PhoneListProps) => {

    //handler
    const {editFav} = useEditContact({})
    const {deleteC} = useDeleteContact({})

    const handlerEditContact = (item: Contact, modal: string) => {
            
        onEditContact(item, modal)
    }

    const handleDelete = (id: number) => {
        deleteC({
            variables: {
                id: id,               
            },  
        })
        onDeleteContact(true)
    }
    const handleEditFavorite = (cek: boolean, item: Contact) => {
        if (cek) {
            const remove = /^0@/;
            const first_name = item.first_name.replace(remove, "");
            editFav({                
                variables:{
                id: item.id,
                _set: {
                    first_name: first_name
                }},  
                refetchQueries: [
                    {
                        query: getContact,
                        variables: {
                            limit: 20,
                            order_by: {
                                first_name: 'asc'
                            },
                        },
                    },
                ],                                                            
            })
        }
        else{
            const regexPattern = /^(.*)$/
            const replacement = "0@$1"
            const first_name = item.first_name.replace(regexPattern, replacement);
            editFav({              
                variables: {
                    id: item.id,
                    _set: {
                        first_name: first_name
                    }
                },
                refetchQueries: [                    
                    {
                        query: getContact,                      
                        variables: {      
                            limit: 20,                           
                            order_by: {
                                first_name: 'asc'
                            },
                        },
                    },
                ],                                                                         
            })              
        }
        
        onMutationCompleted(true);
        
    }

    //edit
    return (
        <PhoneStyle>             
            {             
                (getFirstNonSpaceCharacter(item.first_name) || ' ').toLowerCase() !== (getFirstNonSpaceCharacter(preItem.first_name) || ' ').toLowerCase() || index == 0  ?  (
                    <FontHeaderStyle color='white' theme='third' lang='0'>{isFavorite(item.first_name) ? '❤' : (getFirstNonSpaceCharacter(item.first_name) || ' ').toLocaleUpperCase()}</FontHeaderStyle>) : 
                <FontHeaderStyle color='gray-bg' theme='none' lang='0'> </FontHeaderStyle>
            }                   
            <ContactStyle css={[flexCenter, isExpand]}>        
                    <RoundedContactStyle color={randomColor} css={fullFlexCenter}>
                    {(getFirstNonSpaceCharacter(favFix(item.first_name)) || '').toLocaleUpperCase()}{(getFirstNonSpaceCharacter(item.last_name) || '').toLocaleUpperCase()}
                    </RoundedContactStyle>
                    <NameContactStyle css={isExpand}>
                        <div>
                            {capitalizeFirstLetter(favFix(item.first_name))} {capitalizeFirstLetter(item.last_name)}
                        </div>
                        <div css={phoneRow.number}>
                            {item.phones[0] && item.phones[0].number ? item.phones[0].number : '-'}
                        </div>
                    </NameContactStyle>                
                <ButtonStyle color='success' lang='5px 0 0 5px' onClick={() => openWhatsAppLink(item.phones[0].number) } ><img src={phone} alt="SVG Image"/></ButtonStyle>
                <ButtonStyle color='info' lang='0px' onClick={() => handlerEditContact(item,'edit')}><img src={pencil} alt="SVG Image"/></ButtonStyle>
                <ButtonStyle color={!isFavorite(item.first_name) ? 'favorite' : 'neutral'} lang='0px' onClick={() => handleEditFavorite(isFavorite(item.first_name),item)}><img src={heart} alt="SVG Image" /></ButtonStyle>
                <ButtonStyle color='error' lang='0 5px 5px 0' onClick={() => handleDelete(item.id)}><img src={trash} alt="SVG Image"/></ButtonStyle>                                  
            </ContactStyle>                
        </PhoneStyle>
    )
}

export default PhoneList;


