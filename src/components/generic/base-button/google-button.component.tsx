
// import { signInWithGoogle } from '@/utils/firebase/firebase.auth'
import BaseButton, { buttonType } from './base-button.component'
import { FcGoogle } from '@/assets'
import { supabaseGoogleSignIn } from '@/utils/supabase/supabase.auth';


const GoogleSigninButton = () => {
    // const dispatch = useDispatch();
    const continueWithGoogle = async () => {
        await supabaseGoogleSignIn();
    }
    return (
        <BaseButton rounded={false} type={buttonType.green} clickHandler={continueWithGoogle}
            className="flex items-center justify-center !w-full !px-4 py-2 gap-2 text-sm font-medium "
        >
            <FcGoogle className="h-5 w-5" />
            <span>Continuer avec Google</span>
        </BaseButton>
    )
}

export default GoogleSigninButton