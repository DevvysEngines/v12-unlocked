export function
script_handler
(
    SUPER_CLASS
)
{
    return class extends
    SUPER_CLASS
    {
        // FUNCTIONS

        use
        (...scripts)
        {
            for 
            (let i in scripts)
            {
                if 
                (Array.isArray(scripts[i]))
                {
                    this.insert(...scripts[i]);
                } 
                else 
                {
                    this.insert(scripts[i]);
                }
            }
        }
    }
}