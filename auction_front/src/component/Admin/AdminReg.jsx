import React, { useState,useEffect } from "react"
import $ from "jquery";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { sessionCheck } from "../../util/sessionCheck";
import '../../css/Admin/AdminRegForm.css';

function AdminReg() {

    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);

    // Hook -----------------------------------------------------------------------------------------------------------
    const [IDCehck, setIDCehck] = useState(false);
    const [mailCheck, setMailCheck] = useState(false);

    const navigate = useNavigate();
   
    useEffect(() => {
        sessionCheck(sessionId, navigate);

    }, [sessionId, navigate]);

    // Handler -----------------------------------------------------------------------------------------------------------
    const IdChangeHandler = () => {
        setIDCehck(false);
        $('#id_check_false').text(`아이디 중복 검사를 실행해주세요.`);     
        $('#id_check_true').text('');  
    }

    const IdCheckbtnClick = () => {
        let id = $('input[name="a_id"]').val();

        axios_is_member(id);
    }

    const pwChangehandler = () => {
        let pw = $('input[name="a_pw"]').val();
        let pw_check = $('input[name="a_pw_check"]').val();

        if (pw == pw_check) {
            $('#pw_check_false').text(`비밀번호가 일치합니다.`);
            $('#pw_check_true').text('');
        }
        else {
            $('#pw_check_false').text('');
            $('#pw_check_true').text('비밀번호가 일치하지 않습니다.');
        }
    }

    const adminRegBtnClick = () => {
        let form = document.admin_reg_form;

        if (form.a_id.value == '') {
            alert('아이디를 입력해주세요.')
            form.a_id.focus();
        }
        else if (IDCehck == false) {
            alert('아이디 중복 검사를 완료해주세요.');
            form.a_id.focus();
        }
        else if (form.a_pw.value == '') {
            alert('비밀번호를 입력해주세요.');
            form.a_pw.focus();
        }
        else if (form.a_pw_check.value == '') {
            alert('비밀번호 확인칸을 입력해주세요.');
            form.a_pw_check.focus();
        }
        else if (form.a_pw.value !== form.a_pw_check.value) {
            alert('비밀번호 확인이 일치하지 않습니다.')
            form.a_pw_check.focus();
        } 
        else if (form.a_name.value == '') {
            alert('이름를 입력해주세요.');
            form.a_name.focus();
        }
        else if (form.mail1.value == '') {
            alert('메일 주소를 입력해주세요.');
            form.mail1.focus();
        }
        else if (form.mail2.value == '') {
            alert('메일 주소를 입력해주세요.');
            form.mail2.focus();
        }
        else if (form.phone2.value == '') {
            alert('연락처를 입력해주세요.');
            form.phone2.focus();
        }
        else if (form.phone3.value == '') {
            alert('연락처를 입력해주세요.');
            form.phone3.focus();
        }
        else {
            let a_id = form.a_id.value;
            let a_pw = form.a_pw.value;
            let a_name = form.a_name.value;
            let a_mail = `${form.mail1.value}@${form.mail2.value}`;
            let a_phone = `${form.phone1.value}-${form.phone2.value}-${form.phone3.value}`;


            axios_admin_reg_confirm(a_id, a_pw, a_name, a_mail, a_phone);
        }
    }

    // Function -----------------------------------------------------------------------------------------------------------

    // axios
    async function axios_is_member(id) {
        try {
            const response = await axios.get(`${SERVER_URL.SERVER_URL()}/admin/is_member`, {
                params: { id }
            });
            console.log(response.data);

            if (response.data == 'is_member') {
                $('#id_check_false').text(`사용 중인 아이디입니다.`);     
                $('#id_check_true').text('');     
                setIDCehck(false);
            }
            else if (response.data == 'error') {
                $('#id_check_false').text('오류가 발생했습니다. 다시 시도해주세요.');   
                $('#id_check_true').text('');   
                setIDCehck(false);
            }
            else if (response.data == 'not_member') {
                $('#id_check_false').text('');  
                $('#id_check_true').text(`사용 가능한 아이디입니다.`);
                setIDCehck(true);
            }

        } catch (error) {
            console.log(error);
        }
    }


    async function axios_admin_reg_confirm(a_id, a_pw, a_name,a_mail, a_phone) {

        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/admin/admin_regist_confirm`,
            {
                a_id, a_pw, a_name,a_mail, a_phone
            });

            if (response.data == 'success') {
                alert('어드민 등록이 완료되었습니다.');
                navigate('/admin/home');
            }
            else
                alert('어드민 등록에 실패했습니다.');
    
        } catch (error) {
            console.log(error);
        }
    }

    // view
    return(
        <div className="admin_reg_wrap">
            <div className="admin-reg-wrap-title">어드민 등록</div>

            <form method="post" name="admin_reg_form">

                <div className="input_wrap">
                    <label htmlFor="a_id">관리자 아이디</label>
                    <input type="text" id="a_id" name="a_id" placeholder="아이디를 입력해주세요." onChange={IdChangeHandler}/>
                    <input type="button" value={"아이디 중복 검사"} onClick={IdCheckbtnClick}/>
                    <span id="id_check_false" className="check_msg"></span>
                    <span id="id_check_true" className="check_msg"></span>
                </div>

                <div className="input_wrap">
                    <label htmlFor="a_pw">비밀번호</label>
                    <input type="password" id="a_pw" name="a_pw" placeholder="비밀번호를 입력해주세요." onChange={pwChangehandler}/>
                </div>

                <div className="input_wrap">
                    <label htmlFor="a_pw_check">비밀번호 확인</label>
                    <input type="password" id="a_pw_check" name="a_pw_check" placeholder="비밀번호 확인을 입력해주세요." onChange={pwChangehandler}/>
                </div>

                <div className="check_msg_wrap">
                    <span id="pw_check_false" className="check_msg"></span>
                    <span id="pw_check_true" className="check_msg"></span>
                </div>

                <div className="input_wrap">
                    <label htmlFor="a_name">관리자 이름</label>
                    <input type="text" id="a_name" name="a_name" placeholder="관리자 이름을 입력하세요"/>
                </div>

                <div className="input_wrap">
                    <label>관리자 이메일</label>
                    <input type="text" name="mail1" />
                    @
                    <input type="text" name="mail2" />
                </div>
                
                <div className="input_wrap">
                    <label>관리자 연락처</label>
                    <select name="phone1">
                        <option value="010">010</option>
                        <option value="011">011</option>
                        <option value="016">016</option>
                        <option value="017">017</option>
                        <option value="018">018</option>
                        <option value="019">019</option>
                    </select>
                    -
                    <input type="number" name="phone2"/>
                    -
                    <input type="number" name="phone3"/>
                </div>

                <div className="btns">
                    <button type="button" className="reg_btn" onClick={adminRegBtnClick}>어드민등록</button>
                    <button type="reset" className="reset_btn">초기화</button>
                </div>
                
            </form>
        </div>
    )

}
export default AdminReg;