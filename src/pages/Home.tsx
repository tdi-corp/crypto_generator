import { useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
Table,
TableBody,
TableCaption,
TableCell,
TableFooter,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/Table"  

import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"


import { Badge } from "@/components/ui/Badge"

import { Checkbox } from "@/components/ui/Checkbox"

import { formSchema, secretFieldData, defaultValues, TPrimaryRequest, IPrimaryResponse } from "@/types/form"
import { EyeClosedIcon, EyeOpenIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { clear, createCoin, updateCoin } from "@/store/generatorSlice"
import { useAppDispatch, useAppSelector } from "@/hooks/store"
import { setCoinToState } from "@/lib/crypto"
import { toast } from "@/components/ui/use-toast"
import { Meta } from "@/components/Meta"




const SecretField = ({form, secre2type}: {form: UseFormReturn<TPrimaryRequest>, secre2type: TPrimaryRequest['secre2type']}) => {
  return (
    <FormField
      key={secre2type}
      control={form.control}
      name={`secret.${secre2type}`}
      render={({field: {onChange, value, name}}) => (
        <FormItem>
          <FormControl>
            <Textarea
              placeholder="Enter mnemonic phrase or private key or address"
              name={name}
              value={value}
              onChange={e=>onChange(e)}
          />                  
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />    
  )
}


const MainWindow = ({form}: {form: UseFormReturn<TPrimaryRequest>}) => {


  const secre2type: TPrimaryRequest['secre2type'] = form.watch("secre2type") || 'mnemonic'

  return (
    <div className="bg-[#2E343C] max-w-sm/ min-w-96/ rounded-3xl p-8 ring-1 ring-white/20 shadow-2xl">  

    <div className="">
      <div className="text-xl font-semibold dark:text-white">{secretFieldData[secre2type][1]}</div>
      <p className="text-sm dark:text-muted-foreground">{secretFieldData[secre2type][2]}</p>
    </div>

    <div className="mt-4">
      <SecretField form={form} secre2type={secre2type}/>
    </div>
    <Button
      type="submit"
      className="w-full mt-8"
      disabled={form.formState.isSubmitting}
    >
      {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {secretFieldData[secre2type][3]}
    </Button>
  </div>    
  )
}


const Home = () => {
    const gens = useAppSelector((state)=> state.generator.data)
    const dispatch = useAppDispatch()
    const stateRef = useRef<IPrimaryResponse[]>([])

    stateRef.current = gens
    

    const form = useForm<TPrimaryRequest>({
      resolver: zodResolver(formSchema),
      defaultValues
    })


    const onSubmit: SubmitHandler<TPrimaryRequest> = async (data) => {

      await setCoinToState(data, dispatch, createCoin)
      .then(async () => {

        if(!form.watch("checkBalance")){
          return
        }

        for(const item of stateRef.current) {
          const result = await dispatch(updateCoin(item)).unwrap()

          toast({
            title: `Your ${result.name} address`,
            description: (
              <div>
                <p><span className="dark:text-xs font-medium">{result.address}:</span> {result.balance}</p>
              </div>
            ),
          })          
          
        }

      })

    };
   

    return (
      <>
        <Meta
          title="Crypto Generator"
          description="Generate crypto addresses and check your balance"
        />
        <Headline />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-3/ grid-cols-[_1fr_2fr_1fr] gap-4 mt-10">
                <div className="px-4 pt-8">
                  <FormField
                    control={form.control}
                    name="secre2type"
                    render={({field}) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mnemonic"/>
                              </FormControl>
                              <FormLabel>
                                Mnemonic
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="private"/>
                              </FormControl>
                              <FormLabel>
                                Private key
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="address"/>
                              </FormControl>
                              <FormLabel>
                                Address
                              </FormLabel>
                            </FormItem>                                      
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
  
                <MainWindow form={form} />

                <div className="p-8">

                  <FormField
                    control={form.control}
                    name="checkBalance"
                    render={({ field }) => {
                      return (
                        <FormItem
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(checked)}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Get Balance
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />

                  <ClearButton />

                </div>
              </div>
            </form>
        </Form>

        <div className="mt-10">
          <TableData/>
        </div>
      </>
    )

}


const TableData = () => {

    const generator = useAppSelector((state)=> state.generator.data)
    
    return (
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {generator.length>0 && generator.map((item) => <TableRowData key={item.address} item={item}/>)}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right float-right">?</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
}

const TableRowData = ({item}: {item: any}) => {
  return (
    <TableRow key={item.address}>
    <TableCell className="font-medium">{item.path}</TableCell>
    <TableCell className="">
      <div className="flex items-center gap-1">
      <img src={`/cryptoIcon/${(item.code).toLowerCase()}.svg`} alt={`${item.name} icon`} width="24px" height="24px"/>
        {item.name}
      </div>
    </TableCell>
    <TableCell>
      <p>
        {item.address}
      </p>
      {item.privateKey && <PrivateKey privateKey={item.privateKey} />}
    </TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end align-middle">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </Button>                          
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72">
            <DropdownMenuLabel>Descriptions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2">
              <div className="py-2">
                <div className="text-sm">
                  <div className="font-medium">Status Response:</div>
                  <p className="text-xs font-light">{item.balanceResponseStatus} {item.balanceResponseErrorMessage && `${item.balanceResponseErrorMessage}`}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="py-2">
                <div className="text-sm">
                  <div className="font-medium">Endpoint:</div>
                  <p className="text-xs font-extralight">{item.endpoint}</p>
                </div>
              </div>                            
            </div>
          </DropdownMenuContent>
        </DropdownMenu> 

        <div className="ml-2 py-2 px-2">
          {item.balanceIsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {(item.balanceResponseIsError && !item.balanceIsLoading) && <Badge variant="secondary">!</Badge>}
          {(item.balance && !item.balanceIsLoading) && (typeof item.balance === 'number' ? item.balance : <Badge variant="secondary">?</Badge>)}
        </div>

      </div>
    </TableCell>
  </TableRow>    
  )
}

const PrivateKey = ({privateKey}: {privateKey: string | undefined}) => {
  const [show, setShow] = useState(false)

  function handleClick() {
    setShow(c=>!c)
  }

  if(!privateKey) return;

  return (
    <div className="flex justify-start align-middle w-full">
      <div className="px-2 py-2" onClick={() => handleClick()}>
        {show ? <EyeOpenIcon className="w-3 h-3" /> : <EyeClosedIcon className="w-3 h-3" />}
      </div>
      <span className="text-xs font-light m-auto ml-2 relative">     
          {show ? privateKey : <span>{privateKey.replace(/./gi, '*')}******************</span>}       
      </span>    
    </div>
  )
}

const ClearButton = () => {
  const dispatch = useAppDispatch()

  return (
    <Button 
      variant="outline"
      className="w-full mt-5"
      onClick={(e) => {
        e.preventDefault();
        dispatch(clear())
      }}
    >
      Clear
    </Button>
  )
}


const Headline = (): JSX.Element => {
  return (
    <div className="text-center">
      {/* <span className="text-xs font-black tracking-wide text-white uppercase">Pricing</span> */}
      <p className="text-4xl font-black tracking-tight text-white lg:text-5xl">
      Generate crypto addresses
        <span className="md:block"> and check your balance</span>
      </p>
      <p className="mt-4 text-lg text-gray-400">
        Support for a large number of wallets.
      </p>
    </div>    
  )
}

export default Home;